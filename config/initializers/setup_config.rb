::APP_CONFIG = YAML.load_file("#{Rails.root}/config/config.yml")[Rails.env].symbolize_keys!

CarrierWave.configure do |config|
  config.fog_credentials = {
    :provider               => 'AWS',
    :aws_access_key_id      => APP_CONFIG[:s3_access_key],
    :aws_secret_access_key  => APP_CONFIG[:s3_access_secret]
  }
  config.fog_directory  = "bahrainhub-#{Rails.env}"
  config.fog_attributes = {'x-amz-storage-class' => 'REDUCED_REDUNDANCY'}

  config.storage = Rails.env.production? ? :fog : :file

  if Rails.env.test?
    config.enable_processing = false
  end
end

