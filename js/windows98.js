$(function(){
  var username = window.location.hostname.split(".")[0];
  var repoName = window.location.pathname.split("/")[1];
  loginLink = $('.ventana-login').attr('href') + "&state=" + window.location.href.split('?')[0]
  $('.ventana-login').attr('href', loginLink)

  function reloadOnPublish(lastPublishedAt){
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
    var repo = github.getRepo(username, repoName);

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

  if (window.location.href.match(/\?access_token=(.*)/)){
    var accessToken = window.location.href.match(/\?access_token=(.*)/)[1];
    localStorage.accessToken = accessToken;
  }

  if(localStorage.accessToken){
    window.github = new Github({
      token: localStorage.accessToken,
      auth: "oauth"
    });

    $(".ventana").show();
  }

  $("body").on("click", ".ventana-edit-button",function(event){
    $('.ventana-editor').show();
    $('.ventana-title').show();
    $('.ventana-editor').val($('[data-ventana=content]').text().trim())
    $('.ventana-title').val($('[data-ventana=title]').text().trim())
    var publish = $("<input type=submit class=ventana-publish value=Publish />")
    $('.ventana-edit-button').replaceWith(publish)
  });

  $('.ventana-editor').keyup(function(){
    $('[data-ventana=content]').text($(this).val())
  });

  $('.ventana-title').keyup(function(){
    $('[data-ventana=title]').text($(this).val())
  });

  $(".ventana-logout-button").click(function(){
    localStorage.removeItem("accessToken");
    $(".ventana").hide()
  });

  $("body").on("click",'.ventana-publish', function(event){
    $(event.target).attr("disabled", "true")
    $(event.target).val("Publishing...")
    publish(
      "about.html",
      {
        content: $('.ventana-editor').val(),
        title: $('.ventana-title').val()
      });
  });
});

