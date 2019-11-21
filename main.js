const clientId = "r96qlq1s8z8pmuu7jsgtte31bk1d3b";

document.querySelector("#twitch-auth").addEventListener("click", () => getAccessToken());
document.querySelector("#show-who-is-live").addEventListener("click", () => getFollowedStreams());

function getAccessToken() {
    const url = "https://marcgamesons.github.io/twitch-test/auth";
    const authUrl = 'https://id.twitch.tv/oauth2/authorize?client_id=' + clientId + '&redirect_uri=' + url + '&response_type=token&scope=user_read';
    window.open(authUrl);
}

async function getFollowedStreams() {
    const url = 'https://api.twitch.tv/kraken/streams/followed?limit=100';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': clientId,
                'Authorization': 'OAuth ' + localStorage.getItem('accesstoken')
            }
        });

        const json = await response.json();
        addListElements(json);
    } catch (error) {
        console.error('Error: ' + error);
    }
}

function addListElements(data) {
    const select = document.querySelector("#live-streams");

    for (let i = 0; i < data.streams.length; i++) {

        const option = document.createElement("option");
        option.text = data.streams[i].channel.display_name;
        option.value = data.streams[i].channel.name;
        select.appendChild(option);
    }

    select.addEventListener('change', function () { createEmbed(this.value) });
    select.style.display = "block";
}

function createEmbed(channelName) {
    const element = document.querySelector("#twitch-embed");
    const parent = element.parentNode;
    parent.removeChild(element);

    const div = document.createElement("div");
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