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
    :image_width, :image_height
  belongs_to :voice
  belongs_to :user
  has_many :votes, :dependent => :destroy

  attr_accessor :image_description, :image_title, :url_check, :remote_image_url

  mount_uploader :image, PostImageUploader

  validates :source_url, :presence => true,
    :uniqueness => { :case_sensitive => false },
    :format => { :with => Scrapers::Link.regexp },
    :if => :uploaded_image?
  validates :source_type, :presence => true,
    :inclusion => { :in => %w[video image link] }
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
    source_type=='image' && !(source_url =~ Scrapers::Sources::Flickr.regexp) && !(source_url =~ Scrapers::Sources::Twitpic.regexp) && !(source_url =~ Scrapers::Sources::Yfrog.regexp)
  end

  private

  def url_check_blank
   errors.add(:url_check, "Must be blank") if url_check.present?
  end

  def validate_source_type
    (source_url_changed? && !source_url.blank? && !self.class.exists?(:voice_id => voice_id, :source_url => source_url)) || image_changed?
  end

  def validate_scrape_source
    (source_url_changed? && !source_url.blank? && !self.class.exists?(:voice_id => voice_id, :source_url => source_url) && source_type.present?) || image.present?
  end

  def set_source_type
   if image.blank? || !remote_image_url.blank?
     self.source_type = self.class.detect_type(source_url)
   else
     self.source_type = 'image'
   end
   self.description = image_description if source_type == 'image'
   self.title = image_title if source_type == 'image'
  end

  def scrape_source
    if !(source_type == 'image' && !image.blank?)
      begin
        raise Scrapers::Sources::Exceptions::UnrecognizedSource unless source_type.present?
        scraper = "scrapers/#{source_type}".classify.constantize.new(source_url).scraper
      rescue Scrapers::Sources::Exceptions::UnrecognizedSource
        errors.add(:source_url, "is invalid or is already taken")
        return false
      end

      begin
        scraper.scrape do |data|
          self.title = data.title if title.blank?
          self.description = data.description if description.blank?
          self.remote_image_url = data.image_url if self.remote_image_url.blank?
        end
      rescue Timeout::Error, StandardError
        errors.add(:source_url, :invalid)
        return false
      end
    end
  end

  def set_defaults_strings
    self.title = '(no title)' unless title.present?
    self.description = '(no description)' unless description.present?
  end

  def remove_unsafe_characters
   self.title = title.remove_unsafe if title
   self.description = description.remove_unsafe if description
  end

  def update_source_service
   self.source_service = Post.detect_service(self.source_url).downcase
  end

  def uploaded_image?
   image.blank?
  end
  
end
