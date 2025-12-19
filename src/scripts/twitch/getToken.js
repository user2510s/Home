export default async function getTwitchToken(token, CLIENT_ID) {
  if (!token) return null;

  const userRes = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Client-ID": CLIENT_ID,
    },
  });

  if (!userRes.ok) return null;

  const userData = await userRes.json();

  if (!Array.isArray(userData.data) || userData.data.length === 0) {
    return null;
  }

  return userData.data[0];
}
