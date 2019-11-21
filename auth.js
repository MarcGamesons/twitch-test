let currentHref = window.location.href;
let urlString = currentHref.split("&");
let accessToken = urlString[0].split("=");
localStorage.setItem("accesstoken", accessToken[1]);
window.close();