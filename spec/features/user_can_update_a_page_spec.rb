require "spec_helper"

feature "user editing" do
  scenario "user edits a page" do
    visit '/'

    login

    click_button "Edit Page"
    fill_in "w98-editor", with: "test content"
    click_button "Publish"
  end
end

def login
  visit current_url + "?access_token=token"
end
