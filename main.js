const clientId = 'r96qlq1s8z8pmuu7jsgtte31bk1d3b';
let player;

document.addEventListener('DOMContentLoaded', function () {
    let params = (new URL(document.location)).searchParams;
    let channel_name = params.get('c');

    if (channel_name != null) {
        createPlayerEmbed(channel_name);
    }
});

document.querySelector('#show-who-is-live').addEventListener('click', () => getFollowedStreams());
document.querySelector('#options-container-header').addEventListener('click', () => toggleDropDown());

function getAccessToken() {
    try {
        // const url = 'http://localhost/twitch/auth.html';
        const url = 'https://marcgamesons.github.io/twitch-test/auth';

        const authUrl = 'https://id.twitch.tv/oauth2/authorize?client_id=' + clientId + '&redirect_uri=' + url + '&response_type=token&scope=user_read';
        window.open(authUrl);
    }
    catch (error) {
        console.error('Could not retrieve access token! :: ' + error);
    }
}

function getFollowedStreams() {
    if (!localStorage.getItem('access_token')) {
        getAccessToken();
    }
    else {
        const url = 'https://api.twitch.tv/kraken/streams/followed?limit=100';

        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': clientId,
                'Authorization': 'OAuth ' + localStorage.getItem('access_token')
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                getAccessToken();
                throw new Error('Access token was wrong! Trying to get a new one...');
            }
        }).then((responseJson) => {
            addListElements(responseJson);
        }).catch((error) => {
            console.error('Could not fetch data! :: ' + error);
        });
    }
}

function addListElements(data) {
    document.querySelector('#options-container').style.display = 'block';

    const ul = document.querySelector('#options-list');
    while (ul.firstChild) {
        ul.firstChild.remove();
    }

    for (let i = 0; i < data.streams.length; i++) {

        const li = document.createElement('li');
        li.classList = 'options-list-element';

        ul.appendChild(li);

        const imgPreview = document.createElement('img');
        imgPreview.classList = 'video-preview';
        imgPreview.src = data.streams[i].preview.small;

        const divPreviewContainer = document.createElement('div');
        divPreviewContainer.classList = 'video-preview-container';
        divPreviewContainer.appendChild(imgPreview);

        const divTitle = document.createElement('div');
        divTitle.classList = 'stream-title';
        divTitle.innerHTML = data.streams[i].channel.status;

        const divGame = document.createElement('div');
        divGame.classList = 'game';
        divGame.innerHTML = data.streams[i].channel.game;

        const divStreamer = document.createElement('div');
        divStreamer.classList = 'streamer';
        divStreamer.innerHTML = data.streams[i].channel.display_name;

        li.appendChild(divPreviewContainer);
        li.appendChild(divStreamer);
        li.appendChild(divTitle);
        li.appendChild(divGame);

        li.addEventListener('click', () => toggleDropDown());
        li.addEventListener('click', () => createPlayerEmbed(data.streams[i].channel.name));
    }

    ul.style.display = 'none';
}

function createPlayerEmbed(channelName) {
    const element = document.querySelector('#twitch-player-embed');
    const parent = element.parentNode;
    parent.removeChild(element);

    const div = document.createElement('div');
    div.id = 'twitch-player-embed';
    parent.appendChild(div);

    const options = {
        width: '98%',
        height: 480,
        channel: channelName,
    };

    player = new Twitch.Player('twitch-player-embed', options);
    player.addEventListener(Twitch.Player.READY, changeQuality);
}

function changeQuality() {
    player.removeEventListener(Twitch.Player.READY, changeQuality);
    player.setQuality('160p30');
    player.pause();
}

function toggleDropDown() {
    const dropDown = document.querySelector('#options-list');
    dropDown.style.display == 'block' ? dropDown.style.display = 'none' : dropDown.style.display = 'block';
}