// Display the current day & time
function showCurrentTime(timezone) {
  let nowLocal = new Date();
  let localTime = nowLocal.getTime();
  let localOffset = nowLocal.getTimezoneOffset() * 60000;
  let UTC = localTime + localOffset;
  nowUTC = new Date(UTC + 1000 * timezone);
  let hours = nowUTC.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = nowUTC.getMinutes();
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
  let day = days[nowUTC.getDay()];
  let currentDay = document.querySelector("#current-day");
  currentDay.innerHTML = `${day} ${hours}:${minutes}`;
}

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
  humidity.innerHTML = `${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind: ${Math.round(response.data.wind.speed * 3.6)} km/h`;
  city.innerHTML = response.data.name;
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(response.data.main.temp);

  // Show current weather icon
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  // Store Celsius Temperature as a global variable to convert temperature into Celsius as default
  celsiusTemp = response.data.main.temp;
  fahrenheit.classList.remove("active");
  fahrenheit.classList.add("inactive");
  celsius.classList.add("active");
  celsius.classList.remove("inactive");

  // Get API & call for weather forecast
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiForecastUrl).then(showWeatherForecast);

  // Call function to change background image
  currentTime = response.data.timezone;
  showCurrentTime(currentTime);
  changeBackgroundImage(currentTime);
}

// Change image background per time of the day
function changeBackgroundImage() {
  let hours = nowUTC.getHours();
  if (hours < 6) {
    document.body.style.backgroundImage = "url(images/night.svg)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center -200px";
  } else if (hours < 12) {
    document.body.style.backgroundImage = "url(images/morning.svg)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else if (hours < 18) {
    document.body.style.backgroundImage = "url(images/afternoon.svg)";
    document.body.style.backgroundPosition = "top";
    document.body.style.backgroundSize = "cover";
  } else if (hours < 24) {
    document.body.style.backgroundImage = "url(images/evening.svg)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "top -120px left";
  }
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

// Show weather forecast
function showWeatherForecast(response) {
  dailyForecast = response.data.daily;
  currentForecast = response.data.current;
  let weatherForecast = document.querySelector("#weather-forecast");
  let weatherForecastHTML = `<div class="row">`;
  dailyForecast.slice(1, 7).forEach(function (forecastDay, index) {
    let date = new Date(forecastDay.dt * 1000);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
    if (index < 7) {
      weatherForecastHTML =
        weatherForecastHTML +
        `<div class="col forecast-column"><div class="weather-forecast-day">${day}</div><div><img class="precipitation-icon"
                    src="images/precipitation.svg"
                    alt="humidity"
                    width="20" /><span id="forecast-precipitation">${Math.round(
                      forecastDay.pop * 100
                    )}%</span></div> 
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="${
          forecastDay.weather[0].description
        }" width="50" />
                <div class="forecast-temp">
                  <span class="forecast-temp-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span> <span class="forecast-temp-min text-secondary"
                    >${Math.round(forecastDay.temp.min)}°</span
                  >
                </div>
              </div>`;
    }
  });
  weatherForecastHTML = weatherForecastHTML + `</div>`;
  weatherForecast.innerHTML = weatherForecastHTML;

  // Get current precipitation & UV Index via forecast API
  let currentTempMin = document.querySelector("#current-temp-min");
  currentTempMin.innerHTML = `${Math.round(dailyForecast[0].temp.min)}°`;
  let currentTempMax = document.querySelector("#current-temp-max");
  currentTempMax.innerHTML = `${Math.round(dailyForecast[0].temp.max)}°`;
  let precipitation = document.querySelector("#precipitation");
  let uvi = document.querySelector("#uvi");
  precipitation.innerHTML = `${Math.round(dailyForecast[0].pop * 100)}%`;
  uvi.innerHTML = `UV Index: <span id="rate-color"> ${Math.round(
    currentForecast.uvi
  )}, ${rateUVI()}</span>`;
  if (rateUVI() === "Extreme") {
    document.getElementById("rate-color").style.color = "purple";
  } else if (rateUVI() === "Very high") {
    document.getElementById("rate-color").style.color = "red";
  } else if (rateUVI() === "High") {
    document.getElementById("rate-color").style.color = "orange";
  } else if (rateUVI() === "Moderate") {
    document.getElementById("rate-color").style.color = "#FBC200";
  } else {
    document.getElementById("rate-color").style.color = "green";
  }
}

// Rate the UV Index
function rateUVI() {
  if (Math.round(currentForecast.uvi) < 3) {
    return "Low";
  } else if (Math.round(currentForecast.uvi) < 6) {
    return "Moderate";
  } else if (Math.round(currentForecast.uvi) < 8) {
    return "High";
  } else if (Math.round(currentForecast.uvi) < 11) {
    return "Very high";
  } else {
    return "Extreme";
  }
}

// Convert current & forecast temperature units
function convertTemp(event) {
  let currentTemp = document.querySelector("#current-temp");
  let currentTempMin = document.querySelector("#current-temp-min");
  let currentTempMax = document.querySelector("#current-temp-max");
  let forecastTempMax = document.querySelectorAll(".forecast-temp-max");
  let forecastTempMin = document.querySelectorAll(".forecast-temp-min");
  if (event.target === celsius) {
    currentTemp.innerHTML = Math.round(celsiusTemp);
    currentTempMin.innerHTML = `${Math.round(dailyForecast[0].temp.min)}°`;
    currentTempMax.innerHTML = `${Math.round(dailyForecast[0].temp.max)}°`;
    dailyForecast.slice(1, 7).forEach(function (forecastTemp, index) {
      forecastTempMax[index].innerHTML = `${Math.round(
        forecastTemp.temp.max
      )}°`;
      forecastTempMin[index].innerHTML = `${Math.round(
        forecastTemp.temp.min
      )}°`;
    });
    fahrenheit.classList.remove("active");
    fahrenheit.classList.add("inactive");
    celsius.classList.add("active");
    celsius.classList.remove("inactive");
  } else if (event.target === fahrenheit) {
    currentTemp.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
    currentTempMin.innerHTML = `${Math.round(
      (dailyForecast[0].temp.min * 9) / 5 + 32
    )}°`;
    currentTempMax.innerHTML = `${Math.round(
      (dailyForecast[0].temp.max * 9) / 5 + 32
    )}°`;
    dailyForecast.slice(1, 7).forEach(function (forecastTemp, index) {
      forecastTempMax[index].innerHTML = `${Math.round(
        (forecastTemp.temp.max * 9) / 5 + 32
      )}°`;
      forecastTempMin[index].innerHTML = `${Math.round(
        (forecastTemp.temp.min * 9) / 5 + 32
      )}°`;
    });
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
let dailyForecast = null;
let currentForecast = null;
let currentTime = null;
let nowUTC = null;
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
celsius.addEventListener("click", convertTemp);
fahrenheit.addEventListener("click", convertTemp);
searchForm.addEventListener("submit", getCurrentWeatherAPI);
currentLocation.addEventListener("click", getCurrentWeatherAPI);
showDefaultCity("Hanoi");
