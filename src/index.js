// Display current day & time
let now = new Date();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = [
  `Sunday`,
  `Monday`,
  `Tuesday`,
  `Wednesday`,
  `Thursday`,
  `Friday`,
  `Saturday`,
];
let day = days[now.getDay()];
let currentDay = document.querySelector("#current-day");
currentDay.innerHTML = `${day} ${hours}:${minutes}`;

// Get API for current weather of the default city
function showDefaultCity(city) {
  let apiCurrentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiCurrentDayUrl).then(showCurrentWeather);
}

// Show current weather & get API for weather forecast
function showCurrentWeather(response) {
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind: ${Math.round(response.data.wind.speed * 3.6)} km/h`;
  city.innerHTML = response.data.name;
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(response.data.main.temp);

  // Show weather icon
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  // Store Celsius Temperature as a global variable & convert temperature into Celsius as default
  celsiusTemp = response.data.main.temp;
  fahrenheit.classList.remove("active");
  fahrenheit.classList.add("inactive");
  celsius.classList.add("active");
  celsius.classList.remove("inactive");

  // Get API & call for weather forecast
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiForecastUrl).then(showWeatherForecast);
}

// Get API for current weather when search for a city or click button "Your location"
function getCurrentWeatherAPI(event) {
  event.preventDefault();
  if (event.target === currentLocation) {
    function showPosition(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiCurrentDayUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
      axios.get(apiCurrentDayUrl).then(showCurrentWeather);
    }
    navigator.geolocation.getCurrentPosition(showPosition);
  } else if (event.target === searchForm) {
    let searchInput = document.querySelector("#search-box");
    let apiCurrentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=${unit}`;
    axios.get(apiCurrentDayUrl).then(showCurrentWeather);
  }
}

// Format day of weather forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (day = days[date.getDay()]);
}

// Show weather forecast
function showWeatherForecast(response) {
  console.log(response.data);
  let forecastData = response.data.daily;
  let weatherForecast = document.querySelector("#weather-forecast");
  let weatherForecastHTML = `<div class="row">`;
  forecastData.forEach(function (forecastDay, index) {
    if (index < 6) {
      weatherForecastHTML =
        weatherForecastHTML +
        `<div class="col">
                <div class="weather-forecast-day" id="first-day">${formatDay(
                  forecastDay.dt
                )}</div>
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="${
          forecastDay.weather[0].description
        }" width="50" />
                <div class="weather-forecast-temp" id="first-day-temp">
                  <span class="weather-forecast-temp-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="weather-forecast-temp-min text-secondary"
                    >${Math.round(forecastDay.temp.min)}°</span
                  >
                </div>
              </div>`;
    }
  });
  weatherForecastHTML = weatherForecastHTML + `</div>`;
  weatherForecast.innerHTML = weatherForecastHTML;
}

// Convert temperature unit
function convertTemp(event) {
  let currentTemp = document.querySelector("#current-temp");
  if (event.target === celsius) {
    currentTemp.innerHTML = Math.round(celsiusTemp);
    fahrenheit.classList.remove("active");
    fahrenheit.classList.add("inactive");
    celsius.classList.add("active");
    celsius.classList.remove("inactive");
  } else if (event.target === fahrenheit) {
    currentTemp.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
    celsius.classList.remove("active");
    celsius.classList.add("inactive");
    fahrenheit.classList.add("active");
    fahrenheit.classList.remove("inactive");
  }
}

let city = document.querySelector("#city");
let unit = "metric";
let apiKey = `11b3cb871ddaf6251b502e31b790f412`;
let currentLocation = document.querySelector("#current-location");
let searchForm = document.querySelector("#search-form");
let celsiusTemp = null;
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
celsius.addEventListener("click", convertTemp);
fahrenheit.addEventListener("click", convertTemp);
searchForm.addEventListener("submit", getCurrentWeatherAPI);
currentLocation.addEventListener("click", getCurrentWeatherAPI);

showDefaultCity("Hanoi");
