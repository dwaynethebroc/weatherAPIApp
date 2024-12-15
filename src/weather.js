// weather.js

export { getWeatherDataCityCountry, getWeatherDataGeoLocation}

const getWeatherDataCityCountry = function(){
    const location = readLocationSearch();

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

    const finalURL = (`${APIrequestURL + location.city},${location.country}?key=${key}`);
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
}

const buildDataTableDOM = function(weatherData) {

}

const buildBasicDataDOM = function(weatherData) {
    const rows = ["datetime", "address", "location", "temp", "description", "conditions", "uvindex", "sunrise", "sunset"]
    
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

}

const buildHourlyDOM = function(weatherData) {

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

