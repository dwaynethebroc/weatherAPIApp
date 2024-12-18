// weather.js

export { getWeatherDataCityCountry, getWeatherDataGeoLocation}

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


const getWeatherDataCityCountry = function(){
    const location = readLocationSearch();

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

    const finalURL = (`${APIrequestURL + location.city},${location.country}?unitGroup=metric&key=${key}`);
    console.log(finalURL);

    fetchDataFromServer(finalURL);
}

const getWeatherDataGeoLocation = async function(){
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
    console.log(weatherData);

    masterDOM(weatherData);
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
    buildBasicDataDOM(weatherData);
    buildHourlyDOM(weatherData);
    buildSevenDayDOM(weatherData);
}

const buildBasicDataDOM = function(weatherData) {
    const rows = ["datetime", "address", "location", "temp", "description", "conditions", "uvindex", "sunrise", "sunset"];
    
    const datetime = weatherData.currentConditions.datetime;
    const address = weatherData.resolvedAddress; 
    const location = `${weatherData.latitude}, ${weatherData.longitude}`;
    const temp = `${weatherData.currentConditions.temp} °C`;
    const description = weatherData.description;
    const conditions = weatherData.currentConditions.conditions;
    const uvindex = weatherData.currentConditions.uvindex;
    const sunrise = weatherData.currentConditions.sunrise;
    const sunset = weatherData.currentConditions.sunset;

    const data = {
        datetime: datetime,
        address: address,
        location: location,
        temp: temp,
        description: description,
        conditions: conditions,
        uvindex: uvindex,
        sunrise: sunrise,
        sunset: sunset
    };

    createWeatherTable(rows, data);
    
}

const buildSevenDayDOM = function(weatherData) {
    console.log(weatherData);
    const weekArray = [];
    const rows = ["datetime", "temp", "conditions", "icon"];
    const days = weatherData.days;

    const container = document.createElement('div');
    container.classList.add('weekForecastDiv');
    document.body.appendChild(container);

    const title = document.createElement('h1');
    title.textContent = 'Week Forecast';
    container.appendChild(title);

    const newRow = document.createElement('div');
    newRow.classList.add('WeeklyRow');
    container.appendChild(newRow);

    rows.forEach((row) => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('weeklyRowCellTitle');
        newDiv.textContent = `${row}`;

        newRow.appendChild(newDiv);
    })

    for(let i = 0; i < 7; i++) {
        weekArray.push(days[i]);
    }
    
    weekArray.forEach((weekday) => {
        const data = {};
        data.datetime = weekday.datetime;
        data.temp = weekday.temp;
        data.conditions = weekday.conditions;
        data.icon = weekday.icon;

        const row = document.createElement('div');
        row.classList.add('weatherHourRow');

        Object.keys(data).forEach(function(key) {
            const cellData = document.createElement('div');
            cellData.classList.add('weeklyWeatherCellData');
            if(data[key] === data.temp){
                cellData.textContent = `${data[key] + " °C"}`;
            } else if(data[key] === data.icon){
                const image = iconSwap(data[key]);
                cellData.append(image);
            } else {
                cellData.textContent = `${data[key]}`;
            }

            row.appendChild(cellData);
        });

        container.appendChild(row);
    });

}

const buildHourlyDOM = function(weatherData) {
    console.log(weatherData);
    const rows = ["datetime", "temp", "conditions", "icon"];
    const hours = weatherData.days[0].hours;

    const container = document.createElement('div');
    container.classList.add('hourlyDiv');
    document.body.appendChild(container);

    const title = document.createElement('h1');
    title.textContent = 'Hourly Info';
    container.appendChild(title);

    const newRow = document.createElement('div');
    newRow.classList.add('hourlyRowTitle');
    container.appendChild(newRow);

    rows.forEach((row) => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('hourlyRowCellTitle');
        newDiv.textContent = `${row}`;

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
            cellData.classList.add('hourlyWeatherCellData');
            if(data[key] === data.temp){
                cellData.textContent = `${data[key] + " °C"}`;
            } else if(data[key] === data.icon){
                const image = iconSwap(data[key]);
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
  
    const title = document.createElement('h1');
    title.textContent = 'Basic Info';
    container.appendChild(title);

    // Loop through the rowNames array and create rows for each item
    rowNames.forEach(rowName => {
      const row = document.createElement('div');
      row.classList.add('weather-row'); // Class for individual rows
  
      // Create a label div for the row name
      const label = document.createElement('div');
      label.classList.add('weather-label'); // Class for labels
      label.textContent = rowName;
  
      // Create a value div for the value from the API data
      const value = document.createElement('div');
      value.classList.add('weather-value'); // Class for values
      value.textContent = apiData[rowName]
  
      // Append the label and value to the row
      row.appendChild(label);
      row.appendChild(value);
  
      // Append the row to the container
      container.appendChild(row);
    });
  
    // Append the container to the body or a specific element on the page
    document.body.appendChild(container);
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
    console.log(image.src);
    return image;
};
