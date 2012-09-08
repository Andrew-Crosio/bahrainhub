# encoding: utf-8
class Voice < ActiveRecord::Base
  THEMES = APP_CONFIG[:voice_themes]
  BACKGROUND_VERSIONS = %w[square wide none]

  attr_accessible :title, :description, :theme, :logo_link,
    :latitude, :longitude, :location, :map_url, :twitter_search, :background,
    :featured, :city_or_village, :media_coverage, :archived, :logo, :sponsor_slogan, :sponsor, :rss_feed, :last_rss, :last_tweet, :approved,
    :background_version, :square_background, :wide_background, :background_cache, :wide_background_cache, :square_background_cache

  mount_uploader :logo, LogoUploader
  mount_uploader :background, BackgroundUploader
  mount_uploader :wide_background, WideBackgroundUploader
  mount_uploader :square_background, SquareBackgroundUploader

  belongs_to :user
  has_many :posts, :dependent => :destroy, :order => 'created_at DESC'
  has_many :subscriptions, :dependent => :destroy
  has_one :announcement, :dependent => :destroy

  validates_presence_of :title, :description
  validates_inclusion_of :theme, :in => THEMES
  validates_format_of :rss_feed, :with => Scrapers::Feed.regexp, :if => :check_rss_feed
  validates_inclusion_of :background_version, :in => BACKGROUND_VERSIONS

  before_save :generate_slug
  before_save :reset_feed_timestamps
  after_save :add_content
  after_save :send_notification

  scope :approved, where(:approved => true)
  scope :unapproved, where(:approved => false)
  scope :not_archived, where(:archived => false)
  scope :archived, approved.where(:archived => true)
  scope :current, approved.not_archived
  scope :featured, current.where(:featured => true).order("home_position")
  scope :non_featured, current.where(:featured => false)
  scope :city_or_village, where(:city_or_village => true)
  scope :media_coverage, where(:media_coverage => true)

  acts_as_list :column => 'home_position'

  def expire_cache
    c = ActionController::Base.new
    c.expire_fragment("admin_voice_#{id}_mod")
    c.expire_fragment("voice_#{id}_mod")
    c.expire_fragment("admin_voice_#{id}_public")
    c.expire_fragment("voice_#{id}_public")
    c.expire_fragment("voice_#{id}_rss")
    c.expire_page("/#{slug}.rss")
  end

  def square_version?
    background_version == 'square'
  end

  def wide_version?
    background_version == 'wide'
  end

  def none_version?
    background_version == 'none'
  end

  def check_rss_feed
    rss_feed.blank? ? false : true
  end

  def to_param
    slug
  end

# # Takes preference for map_url attribute over building the link
# # with location.
  def map_link
    map_url.blank? ? "http://maps.google.com/?q=#{CGI::escape location}" : map_url
  end

# Replace special caracters to their equivalents
# and removes non word characters.
  def self.slugize(str)
    base_slug = str.downcase.strip
    base_slug.gsub! /[\s_]/, '-'
    base_slug.gsub! /[áä]/, 'a'
    base_slug.gsub! /[éë]/, 'e'
    base_slug.gsub! /[îï]/, 'i'
    base_slug.gsub! /[óö]/, 'o'
    base_slug.gsub! /[úü]/, 'u'
    base_slug.gsub! /ç/, 'c'
    base_slug.gsub! /œ/, 'ae'
    base_slug.gsub! /ñ/, 'n'
    base_slug.gsub! /[^\w-]/, ''
    count = 1
    while exists?(:slug => base_slug)
     count += 1
     base_slug = "#{base_slug}--#{count}"
    end
    base_slug
  end


# Reset last timestamp of the RSS and twitter inclusion
  def reset_feed_timestamps
    if self.rss_feed_changed?
      self.last_rss = nil
    end
    if self.twitter_search_changed?
      self.last_tweet = nil
    end
  end

# Adds new content based on rss_feed and twitter_search
  def add_content
   if self.rss_feed_changed? and not self.rss_feed.blank?
     unless Rails.env.test?
       Delayed::Job.enqueue ::Jobs::RssFeedJob.new(self.id)
     else
       self.changed_attributes.delete("rss_feed")
       ::VoiceFeeder.fetch_rss(self)
     end
   end

   if self.twitter_search_changed? and not self.twitter_search.blank?
     unless Rails.env.test?
       Delayed::Job.enqueue ::Jobs::RssFeedJob.new(self.id)
     else
       self.changed_attributes.delete("twitter_search")
       ::VoiceFeeder.fetch_tweets(self)
     end
   end
  end

  def send_notification
    ::NotifierMailer.voice_approved(id).deliver if approved_changed? && approved
  end

  private

  def generate_slug
    self.slug = self.class.slugize(title) if title_changed? && title.present?
  end
end

# == Schema Information
#
# Table name: voices
#
#  id                       :integer(4)      not null, primary key
#  title                    :string(255)
#  description              :text
#  theme                    :string(255)
#  user_id                  :integer(4)
#  slug                     :string(255)
#  logo                     :string(255)
#  logo_link                :string(255)
#  sponsor_slogan           :string(255)
#  sponsor                  :string(255)
#  background               :string(255)
#  background_copyright     :string(255)
#  latitude                 :string(255)
#  longitude                :string(255)
#  location                 :string(255)
#  map_url                  :string(255)
#  twitter_search           :string(255)
#  featured                 :boolean(1)      default(FALSE)
#  archived                 :boolean(1)      default(FALSE)
#  rss_feed                 :string(255)
#  last_rss                 :datetime
#  last_tweet               :datetime
#  created_at               :datetime
#  updated_at               :datetime
#  approved                 :boolean(1)      default(FALSE)
#  background_thumb_width   :integer(4)
#  background_thumb_height  :integer(4)
#  background_version       :string(255)     default("square")
#  square_background        :string(255)
#  square_background_width  :integer(4)
#  square_background_height :integer(4)
#  wide_background          :string(255)
#  wide_background_width    :integer(4)
#  wide_background_height   :integer(4)
#  home_position            :integer(4)
#

