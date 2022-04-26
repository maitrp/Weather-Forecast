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

// Show weather
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

  // Convert temperature unit
  function convertTemp(event) {
    if (event.target === celsius) {
      currentTemp.innerHTML = Math.round(response.data.main.temp);
      document.getElementById(`celsius`).style.color = `black`;
      document.getElementById(`fahrenheit`).style.color = `gray`;
      document.getElementById(`celsius`).style.cursor = `none`;
      document.getElementById(`fahrenheit`).style.cursor = `pointer`;
    } else if (event.target === fahrenheit) {
      currentTemp.innerHTML = Math.round(
        (response.data.main.temp * 9) / 5 + 32
      );
      document.getElementById(`fahrenheit`).style.color = `black`;
      document.getElementById(`celsius`).style.color = `gray`;
      document.getElementById(`fahrenheit`).style.cursor = `none`;
      document.getElementById(`celsius`).style.cursor = `pointer`;
    }
  }

  let celsius = document.querySelector("#celsius");
  let fahrenheit = document.querySelector("#fahrenheit");
  celsius.addEventListener("click", convertTemp);
  fahrenheit.addEventListener("click", convertTemp);
}

// Show weather forecast
function showWeatherForecast(response) {
  let firstDay = document.querySelector("#first-day");
  let secondDay = document.querySelector("#second-day");
  let thirdDay = document.querySelector("#third-day");
  let fourthDay = document.querySelector("#fourth-day");
  let fifthDay = document.querySelector("#fifth-day");
  let firstDayTemp = document.querySelector("#first-day-temp");
  let secondDayTemp = document.querySelector("#second-day-temp");
  let thirdDayTemp = document.querySelector("#third-day-temp");
  let fourthDayTemp = document.querySelector("#fourth-day-temp");
  let fifthDayTemp = document.querySelector("#fifth-day-temp");
  firstDay.innerHTML = days[new Date(now.getTime() + 86400000).getDay()];
  secondDay.innerHTML = days[new Date(now.getTime() + 86400000 * 2).getDay()];
  thirdDay.innerHTML = days[new Date(now.getTime() + 86400000 * 3).getDay()];
  fourthDay.innerHTML = days[new Date(now.getTime() + 86400000 * 4).getDay()];
  fifthDay.innerHTML = days[new Date(now.getTime() + 86400000 * 5).getDay()];
  firstDayTemp.innerHTML = `${Math.round(
    response.data.list[9].main.temp_max
  )}° ${Math.round(response.data.list[4].main.temp_min)}°`;
  secondDayTemp.innerHTML = `${Math.round(
    response.data.list[17].main.temp_max
  )}° ${Math.round(response.data.list[12].main.temp_min)}°`;
  thirdDayTemp.innerHTML = `${Math.round(
    response.data.list[25].main.temp_max
  )}° ${Math.round(response.data.list[20].main.temp_min)}°`;
  fourthDayTemp.innerHTML = `${Math.round(
    response.data.list[33].main.temp_max
  )}° ${Math.round(response.data.list[28].main.temp_min)}°`;
  fifthDayTemp.innerHTML = `${Math.round(
    response.data.list[39].main.temp_max
  )}° ${Math.round(response.data.list[35].main.temp_min)}°`;
}

// Search for a city or select current location
function submitPosition(event) {
  event.preventDefault();
  if (event.target === currentLocation) {
    function showPosition(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiCurrentDayUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
      let apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
      axios.get(apiCurrentDayUrl).then(showCurrentWeather);
      axios.get(apiForecastUrl).then(showWeatherForecast);
    }
    navigator.geolocation.getCurrentPosition(showPosition);
  } else if (event.target === searchForm) {
    let searchInput = document.querySelector("#search-box");
    city.innerHTML = searchInput.value;
    let apiCurrentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.innerHTML}&appid=${apiKey}&units=${unit}`;
    let apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.innerHTML}&appid=${apiKey}&units=${unit}`;
    axios.get(apiCurrentDayUrl).then(showCurrentWeather);
    axios.get(apiForecastUrl).then(showWeatherForecast);
  }
}

let city = document.querySelector("#city");
let unit = "metric";
let apiKey = `11b3cb871ddaf6251b502e31b790f412`;
let currentLocation = document.querySelector("#current-location");
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitPosition);
currentLocation.addEventListener("submit", submitPosition);
