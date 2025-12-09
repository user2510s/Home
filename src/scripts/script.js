const searchInput = document.getElementById("searchInput");
const autocompleteBox = document.getElementById("autocompleteBox");
const recentHistory = document.getElementById("recentHistory");

let currentIndex = -1; // para navegação por teclas
let currentItems = []; // itens renderizados

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

function refRecent() {
  if (autocompleteBox.style.display !== "block") {
    recentHistory.style.display = "flex"; // mostra a div
  } else {
    recentHistory.style.display = "none"; // esconde a div
  }
}
setInterval(refRecent, 1500);


document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  document.querySelector(
    ".background"
  ).style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
});

/* ===========================
       GOOGLE SEARCH
=========================== */
function searchGoogle() {
  const input = document.getElementById("searchInput").value.trim();
  if (input === "") return false;

  let url = input;

  // Identifica URL
  if (!input.startsWith("http://") && !input.startsWith("https://")) {
    if (input.includes(".")) {
      url = "https://" + input;
    } else {
      url = "https://www.google.com/search?q=" + encodeURIComponent(input);
    }
  }

  addToHistory(input);
  window.open(url, "_blank");
  document.getElementById("searchInput").value = "";
  return false;
}

/* ===========================
           HISTORY
=========================== */
function addToHistory(text) {
  let history = JSON.parse(localStorage.getItem("recentHistory")) || [];

  const domain = extractDomain(text);
  const now = Date.now();

  // Remove duplicado
  history = history.filter((item) => item.text !== text);

  // Adiciona no início
  history.unshift({
    text: text,
    favicon: `https://www.google.com/s2/favicons?sz=64&domain=${domain}`,
    timestamp: now, // salva a data do acesso
  });

  // Remove itens com mais de 30 dias (1 mês)
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  history = history.filter((item) => now - item.timestamp <= THIRTY_DAYS);

  // Salva todo o histórico válido
  localStorage.setItem("recentHistory", JSON.stringify(history));

  renderHistory();
}

function extractDomain(text) {
  if (text.startsWith("http")) {
    try {
      return new URL(text).hostname;
    } catch {
      return "google.com";
    }
  }

  if (text.includes(".")) {
    return text.replace("www.", "").split("/")[0];
  }

  return "google.com";
}

function renderHistory() {
  const box = document.getElementById("recentHistory");
  const history = JSON.parse(localStorage.getItem("recentHistory")) || [];

  box.innerHTML = "";

  // Mostra apenas os 8 últimos acessos
  history.slice(0, 8).forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.onclick = () => openHistoryItem(item.text);

    div.innerHTML = `
      <img src="${item.favicon}">
      <span class="history-text">${item.text}</span>
    `;

    box.appendChild(div);
  });
}

function openHistoryItem(text) {
  let url = text;

  if (!text.startsWith("http")) {
    if (text.includes(".")) {
      url = "https://" + text;
    } else {
      url = "https://www.google.com/search?q=" + encodeURIComponent(text);
    }
  }

  window.open(url, "_blank");
}

//relogio
function updateClock() {
  const now = new Date();

  let h = now.getHours().toString().padStart(2, "0");
  let m = now.getMinutes().toString().padStart(2, "0");

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

  let date = `${days[now.getDay()]}, ${now.getDate()} ${
    months[now.getMonth()]
  }`;

  document.getElementById("clockTime").textContent = `${h}:${m}`;
  document.getElementById("clockDate").textContent = date;
}

setInterval(updateClock, 1000);
updateClock();

//clima
function loadWeather() {
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;

      let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

      console.log(url)

      let res = await fetch(url);
      let data = await res.json();

      let temp = data.current_weather.temperature;
      let wind = data.current_weather.windspeed;

      document.getElementById(
        "weatherInfo"
      ).innerHTML = `Temperatura: ${temp}ºC<br>Vento: ${wind} km/h`;
    },
    () => {
      document.getElementById("weatherInfo").innerHTML = "Ative a localização.";
    }
  );
}
loadWeather();

/* ===========================
            TODO LIST
=========================== */
let todoList = [];

function loadTodos() {
  let saved = localStorage.getItem("todos");
  if (saved) todoList = JSON.parse(saved);
  renderTodos();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todoList));
}

function renderTodos() {
  const div = document.getElementById("todoList");
  div.innerHTML = "";

  todoList.forEach((task, i) => {
    div.innerHTML += `
      <div class="todo-item">
          <span class="todo-text">${task}</span>
          <span class="todo-remove" onclick="removeTodo(${i})"><img src="../src/images/close-circle-svgrepo-com.svg" width="25px"></span>
      </div>
    `;
  });
}

document.getElementById("todoInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let text = e.target.value.trim();
    if (text !== "") {
      todoList.push(text);
      e.target.value = "";
      saveTodos();
      renderTodos();
    }
  }
});

function removeTodo(i) {
  todoList.splice(i, 1);
  saveTodos();
  renderTodos();
}

loadTodos();

/* ===========================
          ON LOAD
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
});
