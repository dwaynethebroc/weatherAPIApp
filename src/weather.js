// weather.js

export { verifyString, getWeatherDataGeoLocation}

import clearDay from "./imgs/clear-day.svg";
import clearNight from "./imgs/clear-night.svg";
import cloudy from "./imgs/cloudy.svg";
import fog from "./imgs/fog.svg";
import hail from "./imgs/hail.svg";
import partlyCloudyDay from "./imgs/partly-cloudy-day.svg";
import partlyCloudyNight from "./imgs/partly-cloudy-night.svg";
import rainSnowShowersDay from "./imgs/rain-snow-showers-day.svg";
import rainSnowShowersNight from "./imgs/rain-snow-showers-night.svg";
import rainSnow from "./imgs/rain-snow.svg";
import rain from "./imgs/rain.svg";
import showersDay from "./imgs/showers-day.svg";
import showersNight from "./imgs/showers-night.svg";
import sleet from "./imgs/sleet.svg";
import snowShowersDay from "./imgs/snow-showers-day.svg";
import snowShowersNight from "./imgs/snow-showers-night.svg";
import snow from "./imgs/snow.svg";
import thunderRain from "./imgs/thunder-rain.svg";
import thunderShowersDay from "./imgs/thunder-showers-day.svg";
import thunderShowersNight from "./imgs/thunder-showers-night.svg";
import thunder from "./imgs/thunder.svg";
import wind from "./imgs/wind.svg";

const basicInfoDiv = document.getElementById('basicInfo');

const verifyString = function() {
    const cityCountryRegex = /^[a-zA-Z\s\.'-]+,\s*[a-zA-Z\s\.'-]+$/;
    const existingError = document.getElementById('errorMessage');
    const string = document.getElementById('locationSearch');

    if(existingError){
        existingError.remove();
    }

    if (cityCountryRegex.test(string.value)){
        getWeatherDataCityCountry()
    } else {
        const errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage'; 
        errorMessage.innerHTML = "Please enter a new request in the format:<br><strong>City, Country<strong><br>";

        string.value = '';

        const searchDiv = document.querySelector('.search');
        
        searchDiv.append(errorMessage);
    }
}


const getWeatherDataCityCountry = function(){
    const location = readLocationSearch();
    loadingDOM();
    

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

    const finalURL = (`${APIrequestURL + location.city},${location.country}?unitGroup=metric&key=${key}`);
    console.log(finalURL);

    const loadingImg = document.getElementById('loading');
    loadingImg.className = "loading hidden";

    fetchDataFromServer(finalURL);
}

const getWeatherDataGeoLocation = async function(){
    loadingDOM();
    const locationData = await shareLocation();
    console.log(locationData);

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    
    const finalURL = (`${APIrequestURL + locationData.latitude},${locationData.longitude}?unitGroup=metric&key=${key}`);
    console.log(finalURL);

    fetchDataFromServer(finalURL);
}

const shareLocation = function(){
    const latLongData = {}
    return new Promise((resolve, reject) => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => {
                latLongData.latitude = position.coords.latitude;
                latLongData.longitude = position.coords.longitude;
    
                resolve(latLongData);
            });
        } else {
            reject(onFailure("No Geo Data"));
        }
    })
}

const fetchDataFromServer = async function(URL) {
    const response = await fetch(URL, {mode: "cors"});
    const weatherData = await response.json()

    masterDOM(weatherData);
}

const loadingDOM = function(){
    const locationDiv = document.getElementById('search');
    locationDiv.className = "getLocation hidden";

    const loadingDiv = document.getElementById("loading");
    loadingDiv.className = "loading";
}

const closeDOM = function(){
    const div = document.getElementById("loading");
    div.className = "loading hidden";

    const search = document.getElementById('search');
    search.className = "getLocation hidden";
}

const readLocationSearch = function(){
    const searchInput = document.getElementById('locationSearch');

    const searchInputData = searchInput.value.split(',');
    const city = searchInputData[0].trim();
    const country = searchInputData[1].trim();

    searchInput.value = '';

    const location = {city, country};
    return location;
}

const onFailure = function(err){
    console.error(err)
}

const masterDOM = function(weatherData){
    closeDOM();
    buildMainWeatherInfo(weatherData);
    buildBasicDataDOM(weatherData);
    buildHourlyDOM(weatherData);
    buildSevenDayDOM(weatherData);
}

const buildMainWeatherInfo = function(weatherData){
    console.log(weatherData);

    const snapshotDiv = document.createElement('div');
    snapshotDiv.className = "snapshot";

    const rows = ["conditions", "temp", "description"];
    const data = {};
        data.temp = `${weatherData.currentConditions.temp} °C`;
        data.description = weatherData.description;
        data.conditions = weatherData.currentConditions.conditions;
        data.icon = weatherData.currentConditions.icon;

    const title = document.createElement('h1');
    title.textContent = 'Snapshot';
    snapshotDiv.appendChild(title);

    const icon = iconSwap(data.icon);
    icon.classList.add('mainIcon')
    snapshotDiv.appendChild(icon);

    const snapshotContainer = document.getElementById('snapshot');
    snapshotContainer.appendChild(snapshotDiv);

    rows.forEach((row) => {

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('snapshotRow');

        const label = document.createElement('div');
        let labelCapitalized = row[0].toUpperCase() + row.slice(1);
        label.classList.add('snapshotLabel');
        label.textContent = `${labelCapitalized}: `;

        const value = document.createElement('div');
        value.classList.add('weatherValue');
        value.innerText = `${data[row]}`;

        rowDiv.appendChild(label);
        rowDiv.appendChild(value);
        snapshotDiv.appendChild(rowDiv);
    })
    
    const resetButton = document.createElement('button');
    resetButton.classList.add('resetButton');
    resetButton.textContent = 'Change Location';

    resetButton.addEventListener('click', resetLocation);
    snapshotDiv.appendChild(resetButton);
}

const buildBasicDataDOM = function(weatherData) {
    const rows = ["datetime", "address", "uvindex", "sunrise", "sunset"];
    
    const datetime = weatherData.currentConditions.datetimeEpoch;
    const address = weatherData.resolvedAddress; 
    const uvindex = weatherData.currentConditions.uvindex;
    const sunrise = weatherData.currentConditions.sunrise;
    const sunset = weatherData.currentConditions.sunset;

    const data = {
        datetime: datetime,
        address: address,
        uvindex: uvindex,
        sunrise: sunrise,
        sunset: sunset
    };

    const title = document.createElement('h1');
    title.textContent = 'Basic Info';
    basicInfoDiv.appendChild(title);

    createWeatherTable(rows, data);
    
}

const buildHourlyDOM = function(weatherData) {
    const rows = ["datetime", "temp", "conditions", "icon"];
    const hours = weatherData.days[0].hours;

    const container = document.createElement('div');
    container.classList.add('hourlyDiv');
    basicInfoDiv.appendChild(container);

    const title = document.createElement('h1');
    title.textContent = 'Hourly Info';
    container.appendChild(title);

    const newRow = document.createElement('div');
    newRow.classList.add('weatherRowTitle');
    container.appendChild(newRow);

    rows.forEach((row) => {
        if (row === "datetime"){
            row = "Hour";
        }
        const newDiv = document.createElement('div');
        newDiv.classList.add('weatherRowCellTitle');
        const labelCapitalized = row[0].toUpperCase() + row.slice(1);
        newDiv.textContent = `${labelCapitalized}`;

        newRow.appendChild(newDiv);
    })

    hours.forEach((hour) => {
        const data = {};
        data.datetime = hour.datetime;
        data.temp = hour.temp;
        data.conditions = hour.conditions;
        data.icon = hour.icon;

        const row = document.createElement('div');
        row.classList.add('weatherHourRow');

        Object.keys(data).forEach(function(key) {
            const cellData = document.createElement('div');
            cellData.classList.add('weatherCellData');
            if(data[key] === data.temp){
                cellData.textContent = `${data[key] + " °C"}`;
            } else if(data[key] === data.icon){
                const image = iconSwap(data[key]);
                cellData.append(image);
                cellData.classList.add('icon');
            } else if(data[key] === data.datetime) {
                cellData.textContent = `${data[key].slice(0, -3)}`;
            } else {
                cellData.textContent = `${data[key]}`
            }
            

            row.appendChild(cellData);
        });

        container.appendChild(row);
    });
}

const buildSevenDayDOM = function(weatherData) {
    const weekArray = [];
    const rows = ["datetime", "temp", "conditions", "icon"];
    const days = weatherData.days;

    const container = document.createElement('div');
    container.classList.add('weekForecastDiv');
    basicInfoDiv.appendChild(container);

    const title = document.createElement('h1');
    title.textContent = 'Week Forecast';
    container.appendChild(title);

    const newRow = document.createElement('div');
    newRow.classList.add('weatherRowTitle');
    container.appendChild(newRow);

    rows.forEach((row) => {
        if (row === "datetime"){
            row = "Date";
        }
        const newDiv = document.createElement('div');
        newDiv.classList.add('weatherRowCellTitle');
        const labelUpper = row[0].toUpperCase() + row.slice(1);
        newDiv.textContent = `${labelUpper}`;

        newRow.appendChild(newDiv);
    })

    for(let i = 0; i < 7; i++) {
        weekArray.push(days[i]);
    }
    
    weekArray.forEach((weekday) => {
        const data = {};
        data.datetimeEpoch = weekday.datetimeEpoch;
        data.temp = weekday.temp;
        data.conditions = weekday.conditions;
        data.icon = weekday.icon;

        const row = document.createElement('div');
        row.classList.add('weatherHourRow');

        Object.keys(data).forEach(function(key) {
            const cellData = document.createElement('div');
            cellData.classList.add('weatherCellData');
            if(data[key] === data.datetimeEpoch) {
                const d = new Date(data[key]*1000);
                cellData.textContent = `${d.toString().slice(0, -53)}`;
            } else if(data[key] === data.temp){
                cellData.textContent = `${data[key] + " °C"}`;
            } else if(data[key] === data.icon){
                const image = iconSwap(data[key]);
                cellData.classList.add('icon');
                cellData.append(image);
            } else {
                cellData.textContent = `${data[key]}`;
            }

            row.appendChild(cellData);
        });

        container.appendChild(row);
    });

}

function createWeatherTable(rowNames, apiData) {
    // Create a container div for the table
    const container = document.createElement('div');
    container.classList.add('weather-table'); // Optional: Add a class for styling

    // Loop through the rowNames array and create rows for each item
    rowNames.forEach(rowName => {
      const row = document.createElement('div');
      row.classList.add('weather-row'); // Class for individual rows
  
      // Create a label div for the row name
      const label = document.createElement('div');
      label.classList.add('weather-label'); // Class for labels
      let labelCapitalized = rowName[0].toUpperCase() + rowName.slice(1);
      if(labelCapitalized === "Datetime") {
        labelCapitalized = "Time & Date";
      } else if (labelCapitalized === "Uvindex"){
        labelCapitalized = "UV Index";
      } else if (labelCapitalized === "Address"){
        labelCapitalized = "Location";
      }
      label.textContent = labelCapitalized;
  
      // Create a value div for the value from the API data
      const value = document.createElement('div');
      value.classList.add('weather-value'); // Class for values

      if(rowName === "datetime"){
        const d = new Date(apiData[rowName]*1000);
        console.log(d);

        value.textContent = `${d.toString().slice(0, -47)}`;
      } else if (rowName === "sunrise"){
        value.textContent = apiData[rowName].slice(0,-3) + " AM";
      } else if (rowName === "sunset"){
        value.textContent = apiData[rowName].slice(0,-3) + " PM";
      }
      
      else{
        value.textContent = apiData[rowName]
      }

      
  
      // Append the label and value to the row
      row.appendChild(label);
      row.appendChild(value);
  
      // Append the row to the container
      container.appendChild(row);
    });
  
    // Append the container to the body or a specific element on the page
    
    basicInfoDiv.appendChild(container);
  }

const iconSwap = function (weather) {

    const weatherIcons = {
        'clear-day': clearDay,
        'clear-night': clearNight,
        'cloudy': cloudy,
        'fog': fog,
        'hail': hail,
        'partly-cloudy-day': partlyCloudyDay,
        'partly-cloudy-night': partlyCloudyNight,
        'rain-snow-showers-day': rainSnowShowersDay,
        'rain-snow-showers-night': rainSnowShowersNight,
        'rain-snow': rainSnow,
        'rain': rain,
        'showers-day': showersDay,
        'showers-night': showersNight,
        'sleet': sleet,
        'snow-showers-day': snowShowersDay,
        'snow-showers-night': snowShowersNight,
        'snow': snow,
        'thunder-rain': thunderRain,
        'thunder-showers-day': thunderShowersDay,
        'thunder-showers-night': thunderShowersNight,
        'thunder': thunder,
        'wind': wind,
    };

    const image = document.createElement('img');
    const url = weatherIcons[weather]; // Use the weatherIcons map, fallback to default
    image.src = url;
    return image;
};

const resetLocation = function() {
    // const snapshotDiv = document.getElementsByClassName('snapshot');
    // const locationForm = document.getElementsByClassName('getLocation');
    // locationForm.className = 'getLocation';

    console.log('reset function');

    const searchDiv = document.getElementById('search');
    const snapshotDiv = document.getElementById('snapshot');

    snapshotDiv.innerText = '';
    basicInfoDiv.innerText = '';

    searchDiv.className = "getLocation";    
}
