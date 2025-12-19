import weatherWidget from "./weather.js";
import clock from "./clock/clock.js";
import historyModule from "./history.js";
import search from "./search.js";
import shortcut from "./shortcut.js";

const history = historyModule(); // retorna { addToHistory }

const form = document.getElementById("searchForm");

const searchInput = document.getElementById("searchInput");
const autocompleteBox = document.getElementById("autocompleteBox");
const recentHistory = document.getElementById("recentHistory");

let currentIndex = -1; // para navegação por teclas
let currentItems = []; // itens renderizados

function verifyWallpaper(){

const wallpapers = {
  1: "https://w.wallhaven.cc/full/w5/wallhaven-w5eq57.jpg",
  2: "https://w.wallhaven.cc/full/k8/wallhaven-k881zd.jpg",
  3: "https://w.wallhaven.cc/full/w5/wallhaven-w557rr.jpg",
  4: "https://w.wallhaven.cc/full/vp/wallhaven-vpp2g5.png",
};

const keys = Object.keys(wallpapers)

const randomIndex = Math.floor(Math.random() * keys.length);

const randomKey = keys[randomIndex];

const randomValue = wallpapers[randomKey];

if(localStorage.getItem("selectedWallpaper") === null ){
  
  document.getElementById("homeWallpaper").src = randomValue;
  }
}
verifyWallpaper()

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("searchInput").value.trim();
  if (!input) return;

  let url = input;

  if (!input.startsWith("http://") && !input.startsWith("https://")) {
    if (input.includes(".")) {
      url = "https://" + input;
    } else {
      url = "https://www.google.com/search?q=" + encodeURIComponent(input);
    }
  }

  history.addToHistory(input);
  window.open(url, "_blank");
  document.getElementById("searchInput").value = "";
});

searchInput.addEventListener("input", showAutocomplete);
searchInput.addEventListener("keydown", handleKeys);

searchInput.addEventListener("blur", () => {
  setTimeout(() => (autocompleteBox.style.display = "none"), 200);
});

function handleKeys(e) {
  const items = autocompleteBox.querySelectorAll(".autocomplete-item");

  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    currentIndex = (currentIndex + 1) % items.length;
    updateActive(items);
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateActive(items);
  }

  if (e.key === "Enter") {
    if (currentIndex >= 0) {
      items[currentIndex].click();
    }
  }
}

function updateActive(items) {
  items.forEach((i) => i.classList.remove("active"));
  if (items[currentIndex]) {
    items[currentIndex].classList.add("active");
    searchInput.value = items[currentIndex].dataset.text;
  }
}

function showAutocomplete() {
  const query = searchInput.value.trim().toLowerCase();
  currentIndex = -1;

  if (query === "") {
    autocompleteBox.style.display = "none";
    recentHistory.style.display = "flex";

    return;
  }

  const history = JSON.parse(localStorage.getItem("recentHistory")) || [];

  const historyFiltered = history.filter((i) =>
    i.text.toLowerCase().includes(query)
  );
  const domainsFiltered = historyFiltered.filter((i) => i.text.includes("."));
  const searchFiltered = historyFiltered.filter((i) => !i.text.includes("."));

  if (historyFiltered.length === 0) {
    autocompleteBox.style.display = "none";
    recentHistory.style.display = "flex";
    return;
  }

  autocompleteBox.innerHTML = "";
  autocompleteBox.style.display = "block";
  recentHistory.style.display = "none";

  currentItems = [];

  renderSection("Histórico", historyFiltered);
  renderSection("Sites", domainsFiltered);
  renderSection("Pesquisas", searchFiltered);
}

function renderSection(title, list) {
  if (list.length === 0) return;

  const sectionTitle = document.createElement("div");
  sectionTitle.className = "autocomplete-section-title";
  sectionTitle.textContent = title;
  autocompleteBox.appendChild(sectionTitle);

  list.forEach((item) => {
    const div = document.createElement("div");
    div.className = "autocomplete-item";
    div.dataset.text = item.text;

    const query = searchInput.value.trim();
    const highlighted = item.text.replace(
      new RegExp(query, "i"),
      (m) => `<span class="autocomplete-highlight">${m}</span>`
    );

    div.innerHTML = `
            <img src="${item.favicon}" width="16" height="16" style="margin-right: 5px;" >
            <span>${highlighted}</span>
        `;

    div.onclick = () => {
      autocompleteBox.style.display = "none";
      recentHistory.style.display = "flex";

      searchInput.value = item.text;

      // mesma lógica de abrir página
      let url = item.text;

      if (!url.startsWith("http")) {
        if (url.includes(".")) {
          url = "https://" + url;
        } else {
          url = "https://www.google.com/search?q=" + encodeURIComponent(url);
        }
      }

      window.open(url, "_blank");
    };

    autocompleteBox.appendChild(div);
    currentItems.push(div);
  });
}

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 60;
  const y = (e.clientY / window.innerHeight - 0.5) * 60;

  document.querySelector(
    ".background"
  ).style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
});

//search input
search();
//relogio
clock();
//inicia o clima
weatherWidget();

shortcut();

document.body.addEventListener("mousemove", refRecent);

function refRecent() {
  const autocompleteBox = document.getElementById("autocompleteBox");
  const recentHistory = document.getElementById("recentHistory");

  if (autocompleteBox.style.display !== "block") {
    recentHistory.style.display = "flex";
  } else {
    recentHistory.style.display = "none";
  }
}
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const currentTimeEl = document.getElementById("currentTime");
const toggleSize = document.getElementById("toggleSize");
const player = document.getElementById("player");

// Play/Pause
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

// Atualizar contador
audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Formatar tempo
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

//  Minimizar/Maximizar
 toggleSize.addEventListener("click", () => {
   player.classList.toggle("minimized");
 });
