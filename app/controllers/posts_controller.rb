class PostsController < ApplicationController
  before_filter :find_voice
  respond_to :json, :only => [:create]
  respond_to :html, :only => [:show]

  cache_sweeper :posts_sweeper, :only => [:create, :update, :destroy]

  #Creates a new Post instance. Responds to JSON.
  def create
    @post = @voice.posts.new(params[:post])

    if @post.save
      respond_with({:post => @post}, :location => @voice, :status => :success, :content_type => 'text/plain')
    else
      respond_with({:post => nil, :errors => @post.errors}, :location => @voice, :status => :success, :content_type => 'text/plain')
    end
  end

  #Shows a single instance of Post
  def show
    @post = @voice.posts.find(params[:id])
    render :layout => false
  end

  #Scrapes the information from the posted link if it's a URL. Responds
  #to JSON
  def remote_page_info
    info = {}

    begin
      if params[:url]
        scrape = Scrapers::Link.new(params[:url]).scraper
        info = {:title => scrape.title, :description => scrape.description, :images => scrape.images}
      end

      render :json => info
    rescue
      render :json => {:error => t('flash.posts.embedly_time_out')}
    end
  end

  #Destroys a post and redirects to the parent voice.
  def destroy
    post = Post.find(params[:id]).destroy
    redirect_to voice_url(Voice.find(post.voice_id))
  end

  #Generates an exception when embedly fails so it is logged.
  def notify_js_error
    raise Exception.new("EmbedlyDelay: The resource took more than 1 minute.")
    render :nothing => true
  end

  private

  #Finds a voice based on the slug in the URL. Sets `@voice`
  def find_voice
    @voice = Voice.find_by_slug(params[:voice_id])
  end
end
