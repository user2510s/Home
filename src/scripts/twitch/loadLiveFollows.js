export default async function loadLiveFollows(token, CLIENT_ID, user) {
  if (!token || !user) return null;

  // Salvar avatar do usuário
  localStorage.setItem("iconTwitch", user.profile_image_url);

  const userId = user.id;

  const followsRes = await fetch(
    `https://api.twitch.tv/helix/channels/followed?user_id=${userId}&first=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-ID": CLIENT_ID,
      },
    }
  );

  if (!followsRes.ok) {
    console.error("não foi possivel carregar os seus sequidores",
    await followsRes.json());
    return null;
  }

  const followsData = await followsRes.json();

  if (!Array.isArray(followsData.data) || followsData.data.length === 0) {
    return null;
  }

  const followedIds = followsData.data.map((f) => f.broadcaster_id);

  return followedIds.map((id) => `user_id=${id}`).join("&");
}
