# == Schema Information
#
# Table name: announcements
#
#  id         :integer(4)      not null, primary key
#  title      :string(255)
#  content    :text
#  url        :string(255)
#  voice_id   :integer(4)
#  created_at :datetime
#  updated_at :datetime
#

class Announcement < ActiveRecord::Base
  attr_accessible :title, :content, :url, :voice_id
  belongs_to :voice, :dependent => :delete

  validates :title, :presence => true
  validates :content, :presence => true
  validates :voice_id, :presence => true
  validates :url, :format => { :with => URI.regexp(%w[http https]), :allow_nil => true }
end
