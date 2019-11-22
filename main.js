const clientId = "r96qlq1s8z8pmuu7jsgtte31bk1d3b";

document.querySelector("#twitch-auth").addEventListener("click", () => getAccessToken());
document.querySelector("#show-who-is-live").addEventListener("click", () => getFollowedStreams());
document.querySelector("#options-container-header").addEventListener("click", () => toggleDropDown());

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
    document.querySelector("#options-container").style.display = "block";

    const ul = document.querySelector("#options-list");

    for (let i = 0; i < data.streams.length; i++) {

        const li = document.createElement("li");
        li.classList = "options-list-element";

        ul.appendChild(li);

        const imgPreview = document.createElement("img");
        imgPreview.classList = "video-preview";
        imgPreview.src = data.streams[i].preview.small;

        const divPreviewContainer = document.createElement("div");
        divPreviewContainer.classList = "video-preview-container";
        divPreviewContainer.appendChild(imgPreview);

        const divTitle = document.createElement("div");
        divTitle.classList = "stream-title";
        divTitle.innerHTML = data.streams[i].channel.status;

        const divGame = document.createElement("div");
        divGame.classList = "game";
        divGame.innerHTML = data.streams[i].channel.game;

        const divStreamer = document.createElement("div");
        divStreamer.classList = "streamer";
        divStreamer.innerHTML = data.streams[i].channel.display_name;

        li.appendChild(divPreviewContainer);
        li.appendChild(divStreamer);
        li.appendChild(divTitle);
        li.appendChild(divGame);

        li.addEventListener("click", () => toggleDropDown());
        li.addEventListener("click", () => createEmbed(data.streams[i].channel.name));
    }

    ul.style.display = "none";
}

function createEmbed(channelName) {
    const element = document.querySelector("#twitch-embed");
    const parent = element.parentNode;
    parent.removeChild(element);

    const div = document.createElement("div");
    div.id = "twitch-embed";
    parent.appendChild(div);

    var options = {
        width: "98%",
        height: 480,
        channel: channelName,
    };

    player = new Twitch.Player("twitch-embed", options);
}

function toggleDropDown() {
    const dropDown = document.querySelector("#options-list");
    dropDown.style.display == "block" ? dropDown.style.display = "none" : dropDown.style.display = "block";
}

function dropDown() {
    document.querySelector("#options-list").style.display = "block";
}

function selected() {
    document.querySelector("#options-list").style.display = "none";
}