// newtab.js
// Ao abrir nova aba, busca a URL salva e redireciona.
// Se não houver URL salva, mostra um botão para abrir as opções.

const DEFAULT_URL = "https://www.google.com/"; // opção fallback

function validateUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function showMessage(html) {
  document.getElementById('content').innerHTML = html;
}

chrome.storage.sync.get(['newTabUrl'], (result) => {
  const url = result.newTabUrl;
  if (url && validateUrl(url)) {
    // Redireciona para a URL configurada
    window.location.replace(url);
  } else if (url && !validateUrl(url)) {
    showMessage(`<p>URL salva inválida: <code>${url}</code></p>
                 <p><a id="openOptions" href="#">Abrir configurações</a></p>`);
    document.getElementById('openOptions').addEventListener('click', (e) => {
      e.preventDefault();
      // abre a página de opções em nova aba
      chrome.runtime.openOptionsPage();
    });
  } else {
    // sem URL salva -> usar fallback ou oferecer configurar
    showMessage(`<p>Nenhum site configurado para nova aba.</p>
                 <p><a id="openOptions" href="#">Configurar agora</a></p>`);
    document.getElementById('openOptions').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
    // opcional: redirecionar automaticamente para DEFAULT_URL após 1.2s
    setTimeout(() => { window.location.replace(DEFAULT_URL); }, 1200);
  }
});
