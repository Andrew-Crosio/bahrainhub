class PostImageUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
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

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
#  def extension_white_list
#    %w(jpg jpeg gif png)
#  end

  # Override the filename of the uploaded files:
  # def filename
  #   "something.jpg" if original_filename
  # end

end
