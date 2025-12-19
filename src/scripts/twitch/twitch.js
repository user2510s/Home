import getTwitchToken from "./getToken.js";
import loadLiveFollows from "./loadLiveFollows.js";
import streamers from "./streamersProfile.js";

const CLIENT_ID = "4gs492exrl6doxxgrx7iqk6yz22k0u";
const REDIRECT_URI = "http://localhost:5500/auth.html";

// LOGIN
document.getElementById("loginBtn").onclick = () => {
  const authUrl =
    `https://id.twitch.tv/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=token` +
    `&scope=user:read:follows`;

  window.location.href = authUrl;
};

async function init() {
  const token = localStorage.getItem("twitch_token");
  if (!token) return;

  const userData = await getTwitchToken(token, CLIENT_ID);
  if (!userData) return;


  const idParams = await loadLiveFollows(token, CLIENT_ID, userData);
  if (!idParams) return;

  await streamers(token, CLIENT_ID, idParams);
}

init();
