require "bundler"
require "yaml"
Bundler.require(:test)
require "capybara/rspec"
Dir[("./spec/support/**/*.rb")].sort.each { |file| require file }
content = <<-XXX
<script>
w98 = {
  "repo": "window98",
  "username": "masonforest",
  "githubApiUrl": "#{$fake_github}",
  "reloadOnUpdate": true
}
</script>
XXX

Capybara.app = Rack::Builder.new do
  use Rack::InsertHtml,
    content: content,
    insertion_point: '<script src="js/windows98.js"></script>'
  use Rack::Static,
    urls: ["/js", "/css", "/published_at.html"],
    root: "_site",
    index: "index.html",
    header_rules: [
      [:all, {"Cache-Control" => "public, max-age=86400"}]
    ]
  run lambda{ |env| [ 404, { "Content-Type"  => "text/html" }, ["404 - page not found"] ] }
end

Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

Capybara.default_driver = :webkit

Capybara::Webkit.configure do |config|
  config.allow_url("code.jquery.com")
end
