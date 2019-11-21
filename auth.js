var currentHref = window.location.href;
var str = currentHref.split("&");
var accessToken = str[0].split("=");
localStorage.setItem("accesstoken", accessToken[1]);
window.close();
