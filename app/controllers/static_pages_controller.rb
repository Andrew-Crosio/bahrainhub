class StaticPagesController < ApplicationController
  caches_page :about, :sitemap

  layout 'page', :only => [:about]

  #Renders the static about page
  def about
  end

  #Renders the sitemap.xml for search engines
  def sitemap
    @voices = Voice.all
  end
end
