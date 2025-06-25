
const apiKey = "5d734ecea5469f4b372578e0252a1a99"; // Replace with your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name.");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === 200) {
    updateWeather(data);
    saveToHistory(city);
  } else {
    alert("City not found!");
  }
}

async function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        updateWeather(data);
        saveToHistory(data.name);
      }
    }, () => alert("Unable to retrieve location."));
  } else {
    alert("Geolocation not supported.");
  }
}

function updateWeather(data) {
  const icon = data.weather[0].icon;
  const condition = data.weather[0].main.toLowerCase();

  const weatherInfo = `
    <p><strong>${data.name}, ${data.sys.country}</strong></p>
    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="icon"/>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Condition: ${data.weather[0].main}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
  document.getElementById("weatherResult").innerHTML = weatherInfo;

  // Animated Background
  if (condition.includes("rain")) {
    document.body.style.background = "url('https://i.imgur.com/f1vP2cW.gif') no-repeat center center/cover";
  } else if (condition.includes("cloud")) {
    document.body.style.background = "url('https://i.imgur.com/0ZgU5xL.gif') no-repeat center center/cover";
  } else if (condition.includes("clear")) {
    document.body.style.background = "url('https://i.imgur.com/NM9WvPL.gif') no-repeat center center/cover";
  } else {
    document.body.style.background = "linear-gradient(to top, #87cefa, #ffffff)";
  }
}

function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(history));
  }
  displaySearchHistory();
}

function displaySearchHistory() {
  const history = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
  let html = "<h3>Recent Searches:</h3><ul>";
  history.slice(-5).reverse().forEach(city => {
    html += `<li onclick="searchFromHistory('${city}')">${city}</li>`;
  });
  html += "</ul>";
  document.getElementById("historyBox").innerHTML = html;
}

function searchFromHistory(city) {
  document.getElementById("cityInput").value = city;
  getWeather();
}

// Load history on page load
window.onload = displaySearchHistory;
