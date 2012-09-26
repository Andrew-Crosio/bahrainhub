# == Schema Information
#
# Table name: posts
#
#  id                   :integer(4)      not null, primary key
#  voice_id             :integer(4)
#  user_id              :integer(4)
#  title                :string(255)
#  description          :string(255)
#  positive_votes_count :integer(4)      default(0)
#  negative_votes_count :integer(4)      default(0)
#  overall_score        :integer(4)      default(0)
#  source_url           :string(255)
#  source_type          :string(255)
#  source_service       :string(255)
#  image                :string(255)
#  approved             :boolean(1)      default(FALSE)
#  created_at           :datetime
#  updated_at           :datetime
#  copyright            :string(255)
#  image_width          :integer(4)
#  image_height         :integer(4)
#

class Post < ActiveRecord::Base
  attr_accessible :voice_id, :user_id, :title, :description, :remote_image_url,
    :positive_count, :negative_votes_count, :overall_score, :source_url,
    :source_type, :source_service, :image, :approved, :copyright,
    :image_width, :image_height, :image_title, :image_description
  belongs_to :voice
  belongs_to :user
  has_many :votes, :dependent => :destroy

  attr_accessor :image_description, :image_title, :url_check, :remote_image_url

  mount_uploader :image, PostImageUploader

  validates :source_url, :presence => true,
                         :uniqueness => { :case_sensitive => false },
                         :format => { :with => Scrapers::Link.regexp },
                         :unless => :uploaded_image?
  validates :source_type, :presence => true, :inclusion => { :in => %w[video image link] }
  validates :source_service,
    :inclusion => { :in => %w[flickr twitpic yfrog raw youtube vimeo link], :allow_nil => true }
  validate :url_check_blank, :on => :create

  scope :approved, where(:approved => true)
  scope :unapproved, where(:approved => false)
  scope :digest, where("created_at BETWEEN ? AND ?", Time.now.utc.beginning_of_day, Time.now.utc.end_of_day)
  scope :by_type, lambda{ |filter| where(:source_type => filter) }

  before_validation :set_source_type, :if => :validate_source_type
  before_validation :scrape_source, :if => :validate_scrape_source
  before_validation :set_defaults_strings

  before_save :remove_unsafe_characters
  before_save :update_source_service

  def self.detect_type(url)
   if Scrapers::Video.valid_url?(url)
     'video'
   elsif Scrapers::Image.valid_url?(url)
     'image'
   elsif Scrapers::Link.valid_url?(url)
     'link'
   else
     'image'
   end
  end

  def self.detect_service(url)
   case url
     when Scrapers::Sources::YouTube.regexp then 'YouTube'
     when Scrapers::Sources::Vimeo.regexp then 'Vimeo'
     when Scrapers::Sources::Flickr.regexp then 'Flickr'
     when Scrapers::Sources::Twitpic.regexp then 'Twitpic'
     when Scrapers::Sources::Yfrog.regexp then 'Yfrog'
     else 'Link'
   end
  end

# def voted_by?(user, ip, positive_rating)
#  #if positive_rating
#  #  vote = Vote.where("post_id = :id and rating > 0 and (user_id = :user or ip_address = :ip)",{:id => self.id, :user => user, :ip => ip}).pop
#  #else
#    vote = Vote.where("post_id = :id and rating :operator 0 and (user_id = :user or ip_address = :ip)",{:id => self.id, :operator => positive_rating ? '>' : '<', :user => user, :ip => ip}).pop
#  #end
#  vote ? true : false
# end

  def is_raw_image?
    self.source_type == 'image' && !(self.source_url =~ Scrapers::Sources::Flickr.regexp) && !(self.source_url =~ Scrapers::Sources::Twitpic.regexp) && !(self.source_url =~ Scrapers::Sources::Yfrog.regexp)
  end

  private

  def url_check_blank
   errors.add(:url_check, "Must be blank") if self.url_check.present?
  end

  def validate_source_type
    (self.source_url_changed? && !self.source_url.blank? && !self.class.exists?(:voice_id => self.voice_id, :source_url => self.source_url)) || self.image_changed?
  end

  def validate_scrape_source
    (self.source_url_changed? && !self.source_url.blank? && !self.class.exists?(:voice_id => self.voice_id, :source_url => self.source_url) && self.source_type.present?) || self.image.present?
  end

  def set_source_type
    self.source_type = self.class.detect_type(self.source_url)
    if self.source_type == 'image'
      self.description = self.image_description unless self.image_description.blank?
      self.title = self.image_title unless self.image_title.blank?
    end
  end

  def scrape_source
    if self.source_type != 'image' || self.image.blank?
      begin
        raise Scrapers::Sources::Exceptions::UnrecognizedSource unless self.source_type.present?
        scraper = "scrapers/#{self.source_type}".classify.constantize.new(self.source_url).scraper
      rescue Scrapers::Sources::Exceptions::UnrecognizedSource
        return false
      end

      begin
        scraper.scrape do |data|
          self.title = data.title if self.title.blank?
          self.description = data.description if self.description.blank?
          self.remote_image_url = data.image_url if self.remote_image_url.blank? && self.image.blank?
        end
      rescue Timeout::Error, StandardError
        errors.add(:source_url, :invalid)
        return false
      end
    end
  end

  def set_defaults_strings
    self.title = '(no title)' unless self.title.present?
    self.description = '(no description)' unless self.description.present?
  end

  def remove_unsafe_characters
   self.title = self.title.remove_unsafe if self.title
   self.description = self.description.remove_unsafe if self.description
  end

  def update_source_service
   self.source_service = Post.detect_service(self.source_url).downcase
  end

  def uploaded_image?
   !self.image.blank?
  end
  
end
