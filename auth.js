const dummyURL = new URL('http://example.com/');
dummyURL.search = window.location.hash.substr(1);
const access_token = dummyURL.searchParams.get('access_token');
localStorage.access_token = access_token;
window.close();