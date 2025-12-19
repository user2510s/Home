export default function renderIcons(streams, profileMap) {
  const container = document.getElementById("liveIconsContainer");
  container.innerHTML = "";

  streams.forEach((stream) => {
    const login = stream.user_login.toLowerCase();
    const avatar = profileMap[login];

    const icon = document.createElement("div");
    icon.className = "live-icon";

    icon.innerHTML = `
          <img src="${avatar}" alt="${stream.user_name}">
        `;

    icon.addEventListener("click", () => {
      window.open(`https://twitch.tv/${login}`, "_blank");
    });

    container.appendChild(icon);
  });
}
