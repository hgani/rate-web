Sidekiq.options[:poll_interval] = 10
Sidekiq.configure_server do |config|
  path = 'config/schedule.yml'

  if File.exists?(path)
    Sidekiq::Cron::Job.load_from_hash YAML.load_file(path)
  end
end
