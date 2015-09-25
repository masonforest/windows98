require "spec_helper"

feature "user editing" do
  scenario "user edits a page" do
    allow_any_instance_of(FakeGitHub).to receive(:save)
    visit '/'

    login

    click_button "Edit Page"
    fill_in "w98-editor", with: "test content"
    click_button "Publish"
    expect(page).to have_selector(:link_or_button, "Edit Page")

    expect(JSON.parse(FakeGitHub.last_response)).to eq(
      {
        "branch" => "gh-pages",
        "content" => "LS0tCnRpdGxlOiBXZWxjb21lCi0tLQp0ZXN0IGNvbnRlbnQK",
        "message" => "Windows 98 - Update",
      }
    )
  end
end

def login
  visit current_url + "?access_token=token"
end
