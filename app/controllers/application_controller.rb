class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :find_voices

  helper_method :current_user, :get_excerpt

  # Gets the current logged in user's instance and assigns it
  # to `@current_user`
  def current_user
    @current_user ||= User.find_by_id(session[:user_id]) if session[:user_id]
  end

  protected

  #Sets several instance variables with different categories of
  #voices used throughout the page:
  #
  #`@featured_voices`, `@archived_voices`, `@non_featured_voices`, `@unapproved_voices` and `@all_voices`
  def find_voices
    @cities_villages = Voice.city_or_village
    @media_coverage = Voice.media_coverage
    @archived_voices = Voice.archived
    @unapproved_voices = Voice.unapproved
    @all_voices = @unapproved_voices #TODO: Remove this and just use unapproved.

  end

  # Redirects the user to the login page if there is no current session.
  def authenticate_user!
    unless current_user
      redirect_to login_path, :alert => t('flash.application.not_logged_in')
    end
  end

  # Redirects the user to the root path unless he has administrator privilege
  def admin_required
    unless current_user.is_admin?
      redirect_to root_path, :alert => t('flash.application.not_admin')
    end
  end

  # Shortens a string down to complete words contained in the given length
  # @param [String] string the string to be shortened
  # @param [Integer] length the length to which the string will be shortened.
  # @return [String] the string truncated to the expected length
  def get_excerpt(string, length)
    str = string[0..length]
    if string.length > length
      str = str.split(' ')
      str = str[0...(str.length - 1)].join(' ') + '...'
    end
    str
  end
end