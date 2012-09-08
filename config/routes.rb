OpenCrowdvoice::Application.routes.draw do

  resources :users, :only => [:create, :edit, :update, :destroy] do
    get :reset_password
    put :update_password
  end

  controller :static_pages do
    get 'sitemap.:format' => :sitemap, :as => :sitemap, :requirements => { :format => 'xml' }
    get 'about'
  end

  namespace :admin do
    resources :voices, :except => [:show]
    resources :announcements
    resource :homepage, :only => [:show, :update], :controller => 'homepage'
    resources :users
    get 'settings' => 'settings#index', :as => :settings_index
    put 'settings' => 'settings#update', :as => :settings_update
    root :to => 'voices#index'
  end

  resources :subscriptions, :only => [:create] do
    member do
      get 'unsubscribe' => :destroy, :as => :unsubscribe
    end
  end

  get 'login' => 'sessions#new'
  post 'login' => 'sessions#create'
  get 'logout' => 'sessions#destroy'
  get 'reset_password' => 'sessions#reset_password'
  post 'remote_page_info' => 'posts#remote_page_info'
  post 'notify_js_error' => 'posts#notify_js_error'

  match "/widget/:id" => "widgets#show"

 resources :voices, :path => "/", :only => [:show] do
   get 'locations' => 'voices#locations', :constraints => { :format => 'json' }, :on => :collection
   resources :posts, :only => [:show, :create, :destroy] do
     resources :votes, :only => [:create, :destroy], :shallow => true
   end
   resources :supporters, :only => [:create, :destroy]
 end

  root :to => 'home#index'
end

