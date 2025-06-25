
const apiKey = "5d734ecea5469f4b372578e0252a1a99"; // Replace this
const mapKey = "AIzaSyBXjR5ta5Y76Sjo14y2lpdizWNNuvouMQg"; // Replace this

document.getElementById('darkModeToggle').addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

function initMap(lat = 0, lon = 0) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng: lon },
    zoom: 10,
  });
  new google.maps.Marker({ position: { lat, lng: lon }, map });
}

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter a city.");

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  const [weatherRes, forecastRes] = await Promise.all([
    fetch(weatherURL), fetch(forecastURL)
  ]);

  const weatherData = await weatherRes.json();
  const forecastData = await forecastRes.json();

  if (weatherData.cod === 200) {
    updateWeather(weatherData);
    updateForecast(forecastData);
    saveToHistory(city);
    initMap(weatherData.coord.lat, weatherData.coord.lon);
  } else {
    alert("City not found.");
  }
}

function updateWeather(data) {
  const icon = data.weather[0].icon;
  const info = `
    <p><strong>${data.name}, ${data.sys.country}</strong></p>
    <img src="http://openweathermap.org/img/wn/${icon}@2x.png"/>
    <p>Temp: ${data.main.temp}°C</p>
    <p>${data.weather[0].main} | Humidity: ${data.main.humidity}%</p>
  `;
  document.getElementById("weatherResult").innerHTML = info;
}

function updateForecast(data) {
  let html = "<h3>5-Day Forecast</h3><div>";
  const days = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) {
      const icon = item.weather[0].icon;
      days[date] = `
        <div><strong>${date}</strong><br>
        <img src="http://openweathermap.org/img/wn/${icon}.png"/>
        <p>${item.main.temp}°C</p></div>
      `;
    }
  });

  html += Object.values(days).join("") + "</div>";
  document.getElementById("forecastBox").innerHTML = html;
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          updateWeather(data);
          saveToHistory(data.name);
          initMap(lat, lon);
        });
    });
  } else {
    alert("Geolocation not supported.");
  }
}

function startVoiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.start();
  recognition.onresult = function(event) {
    document.getElementById("cityInput").value = event.results[0][0].transcript;
    getWeather();
  };
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

window.onload = displaySearchHistory;
