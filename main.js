document.getElementById("twitch-auth").addEventListener("click",
    function () {
        getAccessToken();
    }
);

document.getElementById("show-who-is-live").addEventListener("click",
    function () {
        getFollowedStreams();
    }
);

var xhttp = new XMLHttpRequest();
var clientId = "r96qlq1s8z8pmuu7jsgtte31bk1d3b";

function getAccessToken() {
    window.open('https://id.twitch.tv/oauth2/authorize?client_id=' + clientId + '&redirect_uri=http://localhost&response_type=token&scope=user_read')
}

function getFollowedStreams() {
    xhttp.open("GET", 'https://api.twitch.tv/kraken/streams/followed');
    xhttp.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
    xhttp.setRequestHeader("Client-ID", clientId);
    xhttp.setRequestHeader("Authorization", 'OAuth ' + localStorage.getItem("accesstoken"));
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);

            var select = document.getElementById("live-streams");
            for (var i = 0; i < data.streams.length; i++) {

                var option = document.createElement("option");
                option.text = data.streams[i].channel.display_name;
                option.value = data.streams[i].channel.name;
                select.appendChild(option);
            }

            select.addEventListener('change', function () { createEmbed(this.value); });
        }
    };
}

function createEmbed(channelName) {

    var element = document.getElementById("twitch-embed");
    var parent = element.parentNode;
    parent.removeChild(element);

    var div = document.createElement("div");
    div.id = "twitch-embed";
    parent.appendChild(div);

    new Twitch.Embed("twitch-embed", {
        width: window.innerWidth,
        height: 480,
        channel: channelName,
        layout: "video",
        autoplay: false
    });
}