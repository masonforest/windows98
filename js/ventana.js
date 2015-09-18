$(function(){
  function reloadOnPublish(lastPublishedAt){
    base = $("")
    $.get("published_at.html",function(data){
      if(lastPublishedAt && lastPublishedAt != data) {
        location.reload();
      } else {
        setTimeout(function(){reloadOnPublish(data)}, 1000)
      }
    });
  }

  function publish(file, content){
    var repo = github.getRepo('masonforest', 'windows98');
    repo.listBranches(function(err,branches) { console.log(branches);})

    repo.read('gh-pages', file, function(err, data) {
      contents = matter.stringify(content, matter(data).data)
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

  console.log(localStorage.accessToken);

  if(localStorage.accessToken){
    window.github = new Github({
      token: localStorage.accessToken,
      auth: "oauth"
    });

    $(".ventana").show();
    editButton = $("<button class=ventana-edit>Edit</button>");
    $(".editable").after(editButton);
  }

  $("body").on("click", ".ventana-edit",function(event){
    var editable = $(event.target).prev(".editable");
    console.log($(editable).text())
    $('.ventana-editor').val(editable.text())
    var publish = $("<input type=submit class=ventana-publish value=Publish />")
    $('.ventana-edit').replaceWith(publish)
  });

  $('.ventana-editor').keyup(function(){
    $('.editable').text($(this).val())
  });

  $("body").on("click",'.ventana-publish', function(){
    console.log($('.ventana-editor').val());
    publish("about.html", $('.ventana-editor').val());
  });
});

