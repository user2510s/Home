import history from "./history.js";

export default function searchGoogle() {
  
  const inputEl = document.getElementById("searchInput");
  if (!inputEl) return false;



  const input = inputEl.value.trim();
  if (!input) {
    console.log(".")
    return false;
  }

  let url;

  if (input.startsWith("http://") || input.startsWith("https://")) {
    url = input;
  } else if (input.includes(".")) {
    url = "https://" + input;
  } else {
    url = "https://www.google.com/search?q=" + encodeURIComponent(input);
  }

  history.addToHistory(input);
  window.open(url, "_blank");
  inputEl.value = "";

  return false;
}
