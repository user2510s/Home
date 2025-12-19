// history.js
export default function historyModule() {
  // --- Constantes
  const HISTORY_KEY = "recentHistory";
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  const FALLBACK_FAVICON =
    "https://i.pinimg.com/474x/5f/5a/00/5f5a002f1d1aacd4928bc099ecba060f.jpg";

  const DEFAULT_DOMAIN = "google.com";

  // ------------------------------------------------------------------
  // Lista real de TLDs conhecidos
  // ------------------------------------------------------------------
  const VALID_TLDS = [
    "com", "net", "org", "io", "co", "dev", "app", "br", "pt", "tv", "gg",
    "be", "ai", "info", "xyz", "one", "shop", "me", "blog", "uk", "us", "ca",
    "es", "de", "fr", "it"
  ];

  // ------------------------------------------------------------------
  // Validação REAL de domínio
  // ------------------------------------------------------------------
  function isValidDomain(domain) {
    if (!domain || typeof domain !== "string") return false;

    const parts = domain.toLowerCase().split(".");
    if (parts.length < 2) return false;

    const tld = parts[parts.length - 1];
    return VALID_TLDS.includes(tld);
  }

  // ------------------------------------------------------------------
  // Extrai domínio de texto ou URL
  // ------------------------------------------------------------------
  function extractDomain(text) {
    if (!text || typeof text !== "string" || text.trim() === "") {
      return DEFAULT_DOMAIN;
    }

    // Tenta analisar como URL completa
    if (text.startsWith("http://") || text.startsWith("https://")) {
      try {
        const url = new URL(text);
        return url.hostname;
      } catch {}
    }

    // Remove protocolos e www
    let cleaned = text
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];

    if (cleaned && isValidDomain(cleaned)) {
      return cleaned;
    }

    return DEFAULT_DOMAIN;
  }

  // ------------------------------------------------------------------
  // Recuperação segura do histórico
  // ------------------------------------------------------------------
  function getSafeHistory() {
    try {
      const historyStr = localStorage.getItem(HISTORY_KEY);
      if (!historyStr) return [];

      let history = JSON.parse(historyStr);
      if (!Array.isArray(history)) return [];

      return history.filter(
        (item) => item && item.text && typeof item.timestamp === "number"
      );
    } catch {
      return [];
    }
  }

  // ------------------------------------------------------------------
  // Ícone gerado via Canvas (inicial)
  // ------------------------------------------------------------------
  function generateInitialIcon(text) {
    if (!text) return "";

    const initial = text.trim().charAt(0).toUpperCase();
    const size = 64;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, size / 2, size / 2 + 2);

    return canvas.toDataURL("image/png");
  }

  // ------------------------------------------------------------------
  // Adiciona item ao histórico
  // ------------------------------------------------------------------
  async function addToHistory(text) {
    if (!text || typeof text !== "string" || text.trim() === "") return;

    let history = getSafeHistory();

    const extracted = extractDomain(text);
    const validDomain = isValidDomain(extracted) ? extracted : DEFAULT_DOMAIN;

    const now = Date.now();

    // Remove duplicados
    history = history.filter((item) => item.text !== text);

    // Adiciona ao início
    history.unshift({
      text: text,
      favicon: `https://www.google.com/s2/favicons?sz=64&domain=${validDomain}`,
      timestamp: now,
    });

    // Mantém apenas itens <= 30 dias
    history = history.filter((item) => now - item.timestamp <= THIRTY_DAYS_MS);

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {}

    renderHistory();
  }

  // ------------------------------------------------------------------
  // Abre item do histórico com lógica de URL real
  // ------------------------------------------------------------------
  function openHistoryItem(text) {
    if (!text) return;

    let url = text;

    if (!text.startsWith("http://") && !text.startsWith("https://")) {
      if (isValidDomain(text)) {
        url = "https://" + text;
      } else {
        url = "https://www.google.com/search?q=" + encodeURIComponent(text);
      }
    }

    try {
      window.open(url, "_blank");
    } catch (e) {
      console.error("Erro ao abrir a URL:", e);
    }
  }

  // ------------------------------------------------------------------
  // Renderização do histórico
  // ------------------------------------------------------------------
  function renderHistory() {
    const box = document.getElementById("recentHistory");
    if (!box) return;

    const history = getSafeHistory();
    box.innerHTML = "";

    history.slice(0, 8).forEach((item) => {
      const div = document.createElement("div");
      div.className = "history-item";

      const img = document.createElement("img");
      img.src = item.favicon || FALLBACK_FAVICON;

      img.onerror = () => {
        const generated = generateInitialIcon(item.text);
        img.src = generated || FALLBACK_FAVICON;
      };

      const span = document.createElement("span");
      span.className = "history-text";
      span.textContent = item.text;

      div.appendChild(img);
      div.appendChild(span);

      div.addEventListener("click", () => openHistoryItem(item.text));

      box.appendChild(div);
    });
  }

  // Inicializa
  renderHistory();

  return { addToHistory };
}
