$(function(){
  if(!window.w98) {
    window.w98 = {};
  }
  if(!window.w98.username) {
    window.w98.username = window.location.hostname.split(".")[0];
  }

  if(!window.w98.repo) {
    window.w98.repo = window.location.pathname.split("/")[1];
  }

  if(!window.w98.githubApiUrl){
    window.w98.githubApiUrl = "https://api.github.com";
  }

  if(window.location.hostname == "localhost"){
    window.w98 = {
      "username": "masonforest",
      "repo": "windows98",
      "reloadOnUpdate": true
    }
  };

  if(!window.w98.uploadPath){
    window.w98.uploadPath = "images";
  }

  loginLink = $('.w98-login').attr('href') + "&state=" + window.location.href.split('?')[0]
  $('.w98-login').attr('href', loginLink)

  function reloadOnPublish(lastPublishedAt){
    if(w98.reloadOnUpdate){
      location.reload();
    }

    $.ajax(
      {
        url: "published_at.html",
        cache: false,
        success: function(data){
        if(lastPublishedAt && lastPublishedAt != data) {
          location.reload();
        } else {
          setTimeout(function(){reloadOnPublish(data)}, 1000)
        }
      }
    });
  }

  function publish(file, page){
    var repo = github.getRepo(w98.username, w98.repo);
    repo.read('gh-pages', file, function(err, data) {
      frontMatter = matter(data).data
      frontMatter.title = page.title
      contents = matter.stringify(page.content, frontMatter)
      repo.write(
        'gh-pages',
        file,
        contents,
        "Windows 98 - Update",
        function(){
          reloadOnPublish();
        }
        )
    });
  }

  function insertImageAtCaret(element, image){
    var imageMarkup = "![Alt]("+ image.src +")"
    insertAtCaret(element, imageMarkup);
  }

  function insertAtCaret(element, content){
    var caretPos = element.selectionStart;
    var textAreaTxt = $(element).val();
    $(element).val(content.substring(0, caretPos) + content + content.substring(caretPos) );
  }

  if (window.location.href.match(/\?access_token=(.*)/)){
    var accessToken = window.location.href.match(/\?access_token=(.*)/)[1];
    localStorage.accessToken = accessToken;
  }

  if(localStorage.accessToken){
    window.github = new Github({
      token: localStorage.accessToken,
      auth: "oauth",
      apiUrl: w98.githubApiUrl
    });

    $(".w98").show();
  }

  $("body").on("click", ".w98-edit-button",function(event){
    $('.w98-editor').show();
    $('.w98-title').show();
    var repo = github.getRepo(w98.username, w98.repo);
    repo.read("gh-pages", $('meta[name=path]').attr("content"), function(err, data) {
      file = matter(data)
      $('.w98-editor').val(file.content)
      $('.w98-title').val(file.data.title)
    });

    var publish = $("<input type=submit class=w98-publish value=Publish />")
    $('.w98-edit-button').replaceWith(publish)
  });

  $('.w98-editor').keyup(function(){
    $('.post-content').text($(this).val())
  });

  $('.w98-title').keyup(function(){
    $('.post-title').text($(this).val())
  });

  $(".w98-logout-button").click(function(){
    localStorage.removeItem("accessToken");
    $(".w98").hide()
  });

  $(".w98-editor").on({
    dragenter: function(e) {
      $(this).css('background-color', '#eef');
    },
    dragleave: function(e) {
      $(this).css('background-color', 'white');
    },
    drop: function(e) {
      e.stopPropagation();
      e.preventDefault();
      files = e.originalEvent.dataTransfer.files;
      for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = ((currentFile) => {
          return function(e) {
            var repo = github.getRepo(w98.username, w98.repo);
            repo.write(
              "gh-pages",
              w98.uploadPath + "/" + currentFile.name,
              e.target.result,
              "Test",
              function(a){
                console.log(a);
              }
              )
          };
        })(f);

        reader.readAsBinaryString(f);
      }
    }
  });

  $("body").on("click",'.w98-publish', function(event){
    $(event.target).attr("disabled", "true")
    $(event.target).val("Publishing...")
    publish(
      $('meta[name=path]').attr("content"),
      {
        content: $('.w98-editor').val(),
        title: $('.w98-title').val()
      });
  });
});

