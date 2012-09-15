xml.instruct!
xml.urlset "xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9" do
  xml.url do
    xml.loc root_url
    xml.lastmod @voices.last.updated_at.to_date
    xml.changefreq "daily"
    xml.priority 0.90
  end
  
  xml.url do
    xml.loc about_url
    xml.lastmod "2012-09-15"
    xml.changefreq "never"
    xml.priority 0.50
  end
  
  @voices.each do |voice|
    xml.url do
      xml.loc voice_url(voice)
      xml.lastmod voice.updated_at.to_date
      xml.changefreq "daily"
      xml.priority 1
    end
  end
end