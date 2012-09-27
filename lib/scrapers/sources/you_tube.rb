module Scrapers
  module Sources
    class YouTube
      class Video < Struct.new(:title, :description, :image_url); end

      @@regexp = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=[^&]/i
      cattr_reader :regexp

      attr_accessor :title, :description, :image_url

      def initialize(url)
        url.sub!(/^http/, 'https') if url.start_with? 'http://'
        @url = url
      end

      def scrape(&block)
        response = get_info
        if response
          yield Video.new(@title, '', @image_url)
        else
          raise Exceptions::NotFound
        end
      end

      def to_s
        'youtube'
      end

      def get_info
        video_id = @url.match(/v=([^&]*)/).captures.first
        response = HTTParty.get("http://gdata.youtube.com/feeds/api/videos/#{video_id}")

        return nil if response.code != 200 || response.parsed_response == "Invalid id"

        doc = Nokogiri::HTML(response.body)
        @title        = doc.search("title").first.inner_text
        @description  = doc.search("description").inner_text
        @image_url    = doc.search("thumbnail")[0][:url]
        doc
      end
    end
  end
end
