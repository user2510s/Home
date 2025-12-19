export default function weather() {
  async function loadWeather() {
    let lat = localStorage.getItem("lat");
    let lon = localStorage.getItem("lon");

    if (!lat || !lon) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;

          localStorage.setItem("lat", lat);
          localStorage.setItem("lon", lon);

          await fetchWeather(lat, lon);
        },
        () => {
          document.getElementById("weatherInfo").innerHTML =
            "Ative a localização.";
        }
      );
    } else {
      await fetchWeather(lat, lon);
    }
  }

  // Mapeamento de weather codes → emojis
  function getWeatherEmoji(code) {
    const map = {
      0: "☀️",   // Céu limpo
      1: "🌤️",  // Poucas nuvens
      2: "⛅",   // Parcialmente nublado
      3: "☁️",   // Nublado
      45: "🌫️",  // Névoa
      48: "🌫️",
      51: "🌦️",  // Garoa leve
      53: "🌧️",
      55: "🌧️",
      56: "🌧️",
      57: "🌧️",
      61: "🌧️",  // Chuva fraca
      63: "🌧️",  // Chuva moderada
      65: "🌧️",  // Chuva forte
      66: "🌧️",
      67: "🌧️",
      71: "🌨️",  // Neve fraca
      73: "❄️",
      75: "❄️",
      77: "❄️",
      80: "🌧️",  // Pancadas leves
      81: "🌧️",
      82: "🌧️🌧️",
      85: "🌨️",
      86: "❄️❄️",
      95: "⛈️",  // Tempestade
      96: "⛈️⚡",
      97: "⛈️⚡"
    };
    return map[code] || "🌍"; // fallback
  }

  async function fetchWeather(lat, lon) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    console.log(url);

    let res = await fetch(url);
    let data = await res.json();

    let temp = data.current_weather.temperature;
    let wind = data.current_weather.windspeed;
    let code = data.current_weather.weathercode;

    let emoji = getWeatherEmoji(code);

    document.getElementById("weatherInfo").innerHTML =
      `${emoji} Temperatura: ${temp}ºC  <br>Vento: ${wind} km/h`;
  }

  loadWeather();
}
