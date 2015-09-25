# Use Sinatra, for example
require 'sinatra/base'
require 'capybara_discoball'

# Define a quick Rack app
class FakeGitHub < Sinatra::Base
  @@last_response = nil

  options "*" do
    response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, Authorization"
    response.headers["Access-Control-Allow-Origin"] = "*"

    status 200
    body ''
  end

  get '/api/v3/repos/:username/:repo/contents/*' do
    response.headers['Access-Control-Allow-Origin'] = '*'
    ""
  end

  put '/api/v3/repos/:username/:repo/contents/*' do
    @@last_response = request.body.read
    response.headers['Access-Control-Allow-Origin'] = '*'
    ""
  end

  def self.last_response
    @@last_response
  end
end

$fake_github = Capybara::Discoball.spin(FakeGitHub)
# require 'pry'
# binding.pry
