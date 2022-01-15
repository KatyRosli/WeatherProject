function formatDate(timestamp) {
  //calculate the date
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return `${day}, ${hours}:${minutes}`;
}

// display city name after sumbit
//display search result city & temperature
function showSearchFormValues(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city");
  let cityInput = document.querySelector("#city-input");
  document.querySelector("#display-temperature-letter").innerHTML = "C";
  document.querySelector("#view-temperature-letter").innerHTML = "F";
  cityElement.innerHTML = cityInput.value;

  let apiKey = "313875bf8edc10d6e458db37d82896b3";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTemperature);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", showSearchFormValues);

// from celsius to fahrenheit
function convertTemperature() {
  let displayValue = document.querySelector("#display-value");
  let displayTemperatureLetter = document.querySelector(
    "#display-temperature-letter"
  );
  let temperatureButtonLetter = "";
  if (displayTemperatureLetter.innerHTML.includes("C")) {
    displayValue.innerHTML = Math.round(displayValue.innerHTML * 1.8 + 32);
    displayTemperatureLetter.innerHTML = "F";
    temperatureButtonLetter = "C";
  } else {
    displayValue.innerHTML = Math.round((displayValue.innerHTML - 32) / 1.8);
    displayTemperatureLetter.innerHTML = "C";
    temperatureButtonLetter = "F";
  }
  document.querySelector("#view-temperature-letter").innerHTML =
    temperatureButtonLetter;
}

let convertButton = document.querySelector("#view-button");
convertButton.addEventListener("click", convertTemperature);

//show current location & temperature & show from search
function showTemperature(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  let displayValueElement = document.querySelector("#display-value");
  let cityElement = document.querySelector("#city");
  // show humidity
  let humidityElement = document.querySelector("#humidity");
  // show wind
  let windElement = document.querySelector("#wind");
  // show weather icon based on the weather
  let iconElement = document.querySelector("#icon");
  // show the day, date & time
  let dateElement = document.querySelector("#date");

  displayValueElement.innerHTML = temperature;
  cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = `${response.data.main.humidity}`;
  windElement.innerHTML = ` ${Math.round(response.data.wind.speed)}`;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  console.log("getCityForecast: " + response.data.name);

  // show city forecast
  getCityForecast(response.data.name);
}

function showPosition(position) {
  let apiKey = "313875bf8edc10d6e458db37d82896b3";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTemperature);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener("click", getCurrentLocation);

//getCurrentLocation();

function getCityForecast(city) {
  let apiKey = "313875bf8edc10d6e458db37d82896b3";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  console.log("getCityForecast:" + url);
  axios.get(url).then((resp) => {
    let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${resp.data.coord.lat}&lon=${resp.data.coord.lon}&units=metric&appid=${apiKey}`;
    axios.get(url2).then((resp) => {
      showForecast(resp);
    });
  });
}

// display 6 forecast
function showForecast(response) {
  var myUl = document.getElementById("forecast");
  myUl.innerHTML = "";
  let forecastElement = document.querySelector("#forecast");
  let forecastText = forecastElement.innerHTML;

  let index = 0;
  console.log(response.data);
  response.data.hourly.forEach((item) => {
    if (index < 6) {
      let date = new Date(item.dt * 1000);
      let hours = date.getHours();
      if (index == 0) {
        hours = "now";
      } else if (hours < 10) {
        hours = `0${hours}`;
      }

      forecastText =
        forecastText +
        `<div class="col-2">${hours}<br />
      <img src="https://openweathermap.org/img/wn/${
        item.weather[0]["icon"]
      }@2x.png" class="forecasticon" id="icon"/> </br>
      ${Math.round(item.temp)}°</div>`;
    }
    index = index + 1;
  });
  forecastElement.innerHTML = forecastText;

  // display weekly climate
  var myUl = document.getElementById("climate");
  myUl.innerHTML = "";
  let climateElement = document.querySelector("#climate");
  let climateText = climateElement.innerHTML;

  let num = 0;
  response.data.daily.forEach((item) => {
    if (num < 7) {
      let date = new Date(item.dt * 1000);
      let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let day = days[date.getDay()];
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
      let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
      climateText =
        climateText +
        `<ul class="list-group list-group-horizontal-sm">
        <li class="list-group-item flex-fill">${day} ${da} ${mo}</li>
        <li class="list-group-item text-center d-inline-block"><img src="https://openweathermap.org/img/wn/${
          item.weather[0]["icon"]
        }@2x.png" class="climateicon" id="iconTwo"></li>
        <li class="list-group-item flex-fill"><strong> Max:<span id="max temperature"> ${Math.round(
          item.temp.max
        )}°</span></strong> Min:<span id="min temperature"></span> ${Math.round(
          item.temp.min
        )}°</li>
        </ul>
        <br>`;
    }
  });
  climateElement.innerHTML = climateText;
}
