class PostImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  include CarrierWave::MimeTypes

  process :set_content_type
  process :convert => 'png'
  storage :fog

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  def default_url
    'https://s3.amazonaws.com/crowdvoice-production/link-default.png'
  end

  version :widget_thumb do
    process :resize_to_fill => [55, 55]
  end

  version :thumb do
    process :resize_to_limit_and_save_geometry => [180, '']
  end

  def resize_to_limit_and_save_geometry(width, height)
    img = resize_to_limit(width, height)
    model.image_width, model.image_height = *img[:dimensions]
  end

  def filename
    super.chomp(File.extname(super)) + '.png'
  end
end
