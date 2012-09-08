# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120908002305) do

  create_table "announcements", :force => true do |t|
    t.string   "title"
    t.text     "content"
    t.string   "url"
    t.integer  "voice_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "posts", :force => true do |t|
    t.integer  "voice_id"
    t.integer  "user_id"
    t.string   "title"
    t.string   "description"
    t.integer  "positive_votes_count", :default => 0
    t.integer  "negative_votes_count", :default => 0
    t.integer  "overall_score",        :default => 0
    t.string   "source_url"
    t.string   "source_type"
    t.string   "source_service"
    t.string   "image"
    t.boolean  "approved",             :default => false
    t.string   "copyright"
    t.integer  "image_width"
    t.integer  "image_height"
    t.datetime "created_at",                              :null => false
    t.datetime "updated_at",                              :null => false
  end

  create_table "settings", :force => true do |t|
    t.text     "name"
    t.text     "value"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "subscriptions", :force => true do |t|
    t.string   "email"
    t.integer  "voice_id"
    t.string   "email_hash"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "email"
    t.string   "encrypted_password"
    t.string   "password_salt"
    t.string   "reset_password_token"
    t.boolean  "is_admin",             :default => false
    t.datetime "created_at",                              :null => false
    t.datetime "updated_at",                              :null => false
  end

  create_table "voices", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.string   "theme"
    t.integer  "user_id"
    t.string   "slug"
    t.string   "logo"
    t.string   "logo_link"
    t.string   "sponsor_slogan"
    t.string   "sponsor"
    t.string   "background"
    t.string   "background_copyright"
    t.string   "latitude"
    t.string   "longitude"
    t.string   "location"
    t.string   "map_url"
    t.string   "twitter_search"
    t.boolean  "featured",                 :default => false
    t.boolean  "archived",                 :default => false
    t.string   "rss_feed"
    t.datetime "last_rss"
    t.datetime "last_tweet"
    t.boolean  "approved",                 :default => false
    t.integer  "background_thumb_width"
    t.integer  "background_thumb_height"
    t.string   "background_version",       :default => "square"
    t.string   "square_background"
    t.integer  "square_background_width"
    t.string   "wide_background"
    t.integer  "wide_background_width"
    t.integer  "wide_background_height"
    t.integer  "square_background_height"
    t.integer  "home_position"
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
    t.boolean  "city_or_village",          :default => false
    t.boolean  "media_coverage",           :default => false
  end

  add_index "voices", ["city_or_village"], :name => "index_voices_on_city_or_village"
  add_index "voices", ["featured"], :name => "index_voices_on_featured"
  add_index "voices", ["media_coverage"], :name => "index_voices_on_media_coverage"

  create_table "votes", :force => true do |t|
    t.string   "ip_address"
    t.integer  "rating"
    t.integer  "post_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
