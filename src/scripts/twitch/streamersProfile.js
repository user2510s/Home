import renderIcons from "./renderLiveIcon.js";

export default async function streamers(token, CLIENT_ID, idParams) {
  if (!token) return;

  const streamsRes = await fetch(
    `https://api.twitch.tv/helix/streams?${idParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-ID": CLIENT_ID,
      },
    }
  );

  if (!streamsRes.ok) {
    console.error("Erro streams:", await streamsRes.json());
    return;
  }

  const streamsData = await streamsRes.json();
  const streams = streamsData?.data ?? [];

  if (streams.length === 0) {
    document.getElementById("liveIconsContainer").innerHTML = "";
    return;
  }

  const loginParams = streams
    .map((s) => `login=${encodeURIComponent(s.user_login)}`)
    .join("&");

  const usersRes = await fetch(
    `https://api.twitch.tv/helix/users?${loginParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-ID": CLIENT_ID,
      },
    }
  );

  if (!usersRes.ok) {
    console.error("Erro users:", await usersRes.json());
    return;
  }

  const usersData = await usersRes.json();

  if (!usersData?.data) {
    console.error("Resposta inválida users:", usersData);
    return;
  }

  const profileMap = {};
  usersData.data.forEach((u) => {
    profileMap[u.login.toLowerCase()] = u.profile_image_url;
  });

  renderIcons(streams, profileMap);
}
