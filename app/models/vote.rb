# == Schema Information
#
# Table name: votes
#
#  id         :integer(4)      not null, primary key
#  ip_address :string(255)
#  rating     :integer(4)
#  post_id    :integer(4)
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer(4)
#

class Vote < ActiveRecord::Base
  attr_accessible :ip_address, :rating, :post_id, :user_id

  belongs_to :post
  belongs_to :user

  validates :ip_address, :presence => true

  after_save :update_vote_counters
  after_save :update_content_approval

  scope :get_vote, lambda{ |post, user, ip| where("post_id = :post and (user_id = :user or ip_address = :ip)", {:post => post, :user => user, :ip => ip}) }

  # Returns true if the vote is positive, false otherwise.
  # @return [Boolean]
  def positive?
    rating == 1
  end

  # Returns true if the vote is negative, false otherwise.
  # @return [Boolean]
  def negative?
    rating == -1
  end

  private

  # updates the counters of the content depending on the vote
  def update_vote_counters
    post.update_column(:positive_votes_count, Vote.where(:post_id => post_id, :rating => 1).count)
    post.update_column(:negative_votes_count, Vote.where(:post_id => post_id, :rating => -1).count)
    post.reload.update_column(:overall_score, post.reload.positive_votes_count - post.reload.negative_votes_count)
  end

  # Approves content if overall_score is greater than zero
  def update_content_approval
    post.update_column(:approved, true) if post.overall_score >= Setting.positive_threshold.to_i
    post.update_column(:approved, false) if post.overall_score <= Setting.negative_threshold.to_i
  end

end

