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

  function edit(file, title){
    $('.w98-editor').show();
    $('.w98-title').show();
    var repo = github.getRepo(w98.username, w98.repo);
    repo.read("gh-pages", file, (err, data) => {
      file = matter(data)
      $('.w98-editor').val(file.content)
      $('.w98-title').val(title ? title : file.data.title)
      $('.w98-title').keyup()
    });

    var publish = $("<input type=submit class=w98-publish value=Publish />")
    $('.w98-edit-button').replaceWith(publish)
  }

  $("body").on("click", ".w98-edit-button",function(event){
    event.preventDefault();
    edit($('meta[name=path]').attr("content"));
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

  $(".w98-add-page").click(function(e){
    e.preventDefault();
    title = prompt("Title:");
    fileName = title.replace(/\s+/, "_").toLowerCase() + ".md";
    url = title.replace(/\s+/, "_").toLowerCase() + ".html";
    history.pushState({}, title, url);

    $("body").load("page_template.html", function(){
      $('.post-title').text(title);
      edit("page_template.html")
    })
  });

  function date(){
    var date = new Date();
    var day = (date.getDate() < 10) ?  ("0" + date.getDate()) : date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    return year + "-" + month + "-" + day;
  }

  $(".w98-add-post").click(function(e){
    e.preventDefault();
    title = prompt("Title:");

    fileName = "_posts/" + date() +"-"+ title.replace(/\s+/, "-").toLowerCase() + ".md";
    $('meta[name=path]').attr("content", fileName);
    url = title.replace(/\s+/, "_").toLowerCase() + ".html";
    history.pushState({}, title, url);

    $("body").load("post_template.html", function(){
      $('.post-title').text(title);
      edit("post_template.md", title);
    })
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

