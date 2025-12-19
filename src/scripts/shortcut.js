export default function shortcut() {
  const container = document.getElementById("shortcutsContainer");
  const addBtn = document.getElementById("addShortcutBtn");
  const modal = document.getElementById("shortcutModal");
  const saveBtn = document.getElementById("saveShortcut");
  const closeBtn = document.getElementById("closeModal");

  const contextMenu = document.getElementById("contextMenu");
  const ctxEdit = document.getElementById("ctxEdit");
  const ctxDelete = document.getElementById("ctxDelete");

  let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];

  let editIndex = null;
  let rightClickIndex = null;

  /* -----------------------------
   * FAVICON → com fallback automático
   * ----------------------------- */
  function normalizeUrl(url) {
    url = url.trim();

    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }

    return url;
  }

  function getFavicon(url) {
    try {
      url = normalizeUrl(url); // <--- agora sempre garante https://

      const domain = new URL(url).hostname;
      const googleIcon = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

      return new Promise((resolve) => {
        const img = new Image();
        img.src = googleIcon;

        img.onload = () => resolve(googleIcon);
        img.onerror = () => resolve(generateLetterFallback(domain));
      });
    } catch {
      return generateLetterFallback("?");
    }
  }

  /* -----------------------------
   * Fallback estilo Chrome (primeira letra)
   * ----------------------------- */

  function generateLetterFallback(domain) {
    const first = domain[0]?.toUpperCase() || "?";

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#A142F4"];
    const bg = colors[Math.floor(Math.random() * colors.length)];

    // fundo redondo
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    // letra
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(first, 32, 34);

    return canvas.toDataURL("image/png");
  }

  renderShortcuts();

  /* -----------------------------
   * Renderizar atalhos
   * ----------------------------- */
  function renderShortcuts() {
    container.innerHTML = "";

    shortcuts.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "shortcut";
      div.dataset.index = index;

      div.onclick = (e) => {
        if (e.button === 0) window.open(item.url, "_blank");
      };

      div.oncontextmenu = (e) => {
        e.preventDefault();
        rightClickIndex = index;
        openContextMenu(e.pageX, e.pageY);
      };

      div.innerHTML = `
        <div class="shortcut-icon">
          <img src="${item.icon}">
        </div>
        <span>${item.name}</span>
      `;

      container.appendChild(div);
    });
  }

  /* -----------------------------
   * MENU DE CONTEXTO (botão direito)
   * ----------------------------- */
  function openContextMenu(x, y) {
    contextMenu.style.left = x + "px";
    contextMenu.style.top = y + "px";
    contextMenu.style.display = "block";
  }

  // Detecta clique com botão direito
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // impede o menu padrão do navegador
    openContextMenu(e.clientX, e.clientY);
  });

  // Fecha ao clicar fora
  document.addEventListener("click", () => {
    contextMenu.style.display = "none";
  });

  /* Editar */
  ctxEdit.onclick = () => {
    const item = shortcuts[rightClickIndex];
    editIndex = rightClickIndex;

    document.getElementById("siteName").value = item.name;
    document.getElementById("siteUrl").value = item.url;

    document.getElementById("modalTitle").innerText = "Editar Atalho";
    modal.style.display = "block";
  };

  /* Excluir */
  ctxDelete.onclick = () => {
    shortcuts.splice(rightClickIndex, 1);
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    renderShortcuts();
    contextMenu.style.display = "none";
  };

  /* -----------------------------
   * Abrir modal para novo atalho
   * ----------------------------- */
  addBtn.onclick = () => {
    editIndex = null;
    document.getElementById("modalTitle").innerText = "Adicionar Atalho";

    document.getElementById("siteName").value = "";
    document.getElementById("siteUrl").value = "";

    modal.style.display = "block";
  };

  /* Fechar modal */
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  const defaultShortcuts = [
    {
      name: "Google",
      url: "https://www.google.com",
      icon: "https://www.google.com/favicon.ico",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com",
      icon: "https://www.youtube.com/favicon.ico",
    },
    {
      name: "GitHub",
      url: "https://github.com",
      icon: "https://github.com/favicon.ico",
    },
  ];
  function initDefaultShortcuts() {
    const initialized = localStorage.getItem("shortcuts_initialized");

    if (initialized) return;

    localStorage.setItem("shortcuts", JSON.stringify(defaultShortcuts));
    localStorage.setItem("shortcuts_initialized", "true");
  }
  function loadShortcuts() {
    const data = localStorage.getItem("shortcuts");
    shortcuts = data ? JSON.parse(data) : [];
    renderShortcuts();
  }
  document.addEventListener("DOMContentLoaded", () => {
    initDefaultShortcuts();
    loadShortcuts();
  });


  saveBtn.onclick = async () => {
    let name = document.getElementById("siteName").value.trim();
    let url = document.getElementById("siteUrl").value.trim();

    if (!name || !url) {
      alert("Preencha nome e URL.");
      return;
    }

    url = normalizeUrl(url);
    const icon = await getFavicon(url);

    if (editIndex !== null) {
      shortcuts[editIndex] = { name, url, icon };
    } else {
      shortcuts.push({ name, url, icon });
    }

    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    renderShortcuts();
    modal.style.display = "none";
  };
}
