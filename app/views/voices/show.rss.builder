xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Content for voice #{@voice.title} on BahrainHub.org"
    xml.description "Listing of all contents for voice #{@voice.title} on BahrainHub.org"
    xml.link voice_url(@voice, :format => :rss)
    for post in @posts
      xml.item do
        xml.title post.title
        xml.description "#{image_tag(post.image.thumb.url)} #{post.description}"
        xml.pubDate post.created_at.to_s(:rfc822)
        xml.link voice_url(@voice, :post => post.id)
        xml.guid voice_url(@voice, :post => post.id)
      end
    end
  end
end

