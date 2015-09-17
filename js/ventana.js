$(function(){
  if (window.location.href.match(/\?access_token=(.*)/)){
    var accessToken = window.location.href.match(/\?access_token=(.*)/)[1];
    localStorage.accessToken = accessToken;
  }

  if(localStorage.accessToken){
    $(".ventana").show();
    editButton =("<button>Edit</button>");
    $(".editable").attr("contenteditable", "true");
    $(".editable").prepend(editButton);
  }
});

