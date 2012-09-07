xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Content for home on BahrainHub.org"
    xml.description "Listing of all featured contents for BahrainHub.org"
    xml.link root_url(:format => :rss)
    for voice in @all_voices
      xml.item do
        xml.title voice.title
        xml.description voice.description
        xml.pubDate voice.created_at.to_s(:rfc822)
        xml.link voice_url(voice)
        xml.guid voice_url(voice)
      end
    end
  end
end