const overlay = document.getElementById("overlay");
const input = document.getElementById("passwordInput");
const errorMsg = document.getElementById("passwordError");
const btn = document.getElementById("passwordBtn");

const CORRECT_PASSWORD = "1234";
const ONE_HOUR = 60 * 60 * 1000;

function showPopup() {
    overlay.style.display = "flex";
}

function hidePopup() {
    overlay.style.display = "none";
}

function checkPassword() {
    if (input.value === CORRECT_PASSWORD) {
        // salva o horário atual em milissegundos
        localStorage.setItem("authTime", Date.now().toString());
        hidePopup();
    } else {
        errorMsg.textContent = "Senha incorreta!";
        input.value = "";
    }
}

btn.addEventListener("click", checkPassword);

window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("authTime");

    if (!saved) {
        // nunca autenticou
        showPopup();
        return;
    }

    const lastAuth = Number(saved);
    const now = Date.now();

    console.log("Última autenticação:", new Date(lastAuth).toLocaleTimeString());
    console.log("Passaram", Math.floor((now - lastAuth)/60000), "minutos");

    // Se passou de 1h → pedir senha
    if (now - lastAuth >= ONE_HOUR) {
        showPopup();
    } else {
        hidePopup();
    }
});
