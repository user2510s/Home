export default function clock() {
  const now = new Date();

  let h = now.getHours().toString().padStart(2, "0");
  let m = now.getMinutes().toString().padStart(2, "0");
  let s = now.getSeconds().toString().padStart(2, "0"); // segundos

  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  let date = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;

  // agora com segundos
  document.getElementById("clockTime").textContent = `${h}:${m}:${s}`;
  document.getElementById("clockDate").textContent = date;
}

setInterval(clock, 1000);
("");
