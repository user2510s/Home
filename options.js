// options.js
const urlInput = document.getElementById('url');
const form = document.getElementById('form');
const status = document.getElementById('status');
const openNowBtn = document.getElementById('openNow');
const resetBtn = document.getElementById('reset');

function setStatus(msg, ok = true) {
  status.textContent = msg;
  status.style.color = ok ? 'green' : 'red';
  setTimeout(() => { status.textContent = ''; }, 3000);
}

function validateUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
}

// Carrega URL salva
chrome.storage.sync.get(['newTabUrl'], (result) => {
  if (result.newTabUrl) urlInput.value = result.newTabUrl;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const u = urlInput.value.trim();
  if (!validateUrl(u)) {
    setStatus('URL inválida. Use http:// ou https://', false);
    return;
  }
  chrome.storage.sync.set({ newTabUrl: u }, () => {
    setStatus('URL salva com sucesso.');
  });
});

openNowBtn.addEventListener('click', () => {
  const u = urlInput.value.trim();
  if (!validateUrl(u)) {
    setStatus('URL inválida. Use http:// ou https://', false);
    return;
  }
  // abre nova aba com a URL selecionada
  chrome.tabs.create({ url: u }, () => {});
});

resetBtn.addEventListener('click', () => {
  chrome.storage.sync.remove('newTabUrl', () => {
    urlInput.value = '';
    setStatus('Configuração removida.');
  });
});
