async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "5d734ecea5469f4b372578e0252a1a99"; // 🔁 Replace with your actual API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === 200) {
    const weatherInfo = `
      <p>📍 <strong>${data.name}, ${data.sys.country}</strong></p>
      <p>🌡️ Temperature: ${data.main.temp}°C</p>
      <p>☁️ Condition: ${data.weather[0].main}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind Speed: ${data.wind.speed} m/s</p>
    `;
    document.getElementById("weatherResult").innerHTML = weatherInfo;
  } else {
    document.getElementById("weatherResult").innerHTML = `<p>❌ City not found!</p>`;
  }
 const condition = data.weather[0].main.toLowerCase();
document.body.style.background = condition.includes("rain") ? "#aec6cf" :
                                  condition.includes("cloud") ? "#d3d3d3" :
                                  condition.includes("clear") ? "#f7e9a0" :
                                  "#ffffff";

}
async function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "5d734ecea5469f4b372578e0252a1a99"; // replace with your real key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        const weatherInfo = `
          <p>📍 <strong>${data.name}, ${data.sys.country}</strong></p>
          <p>🌡️ Temperature: ${data.main.temp}°C</p>
          <p>☁️ Condition: ${data.weather[0].main}</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>🌬️ Wind Speed: ${data.wind.speed} m/s</p>
        `;
        document.getElementById("weatherResult").innerHTML = weatherInfo;
      }
    }, () => {
      alert("Unable to retrieve location.");
    });
  } else {
    alert("Geolocation not supported by this browser.");
  }
const condition = data.weather[0].main.toLowerCase();
document.body.style.background = condition.includes("rain") ? "#aec6cf" :
                                  condition.includes("cloud") ? "#d3d3d3" :
                                  condition.includes("clear") ? "#f7e9a0" :
                                  "#ffffff";
}
