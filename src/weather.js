// weather.js

export { getWeatherDataCityCountry, getWeatherDataGeoLocation}

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

    console.log(days);

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

    console.log(hours);

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

  const iconSwap = function(weather){
        const image = document.createElement('img');
        let url = ''; 
        switch (weather) {
            case 'clear-day':
                url = 'src/imgs/clear-day.svg';
                break;
            case 'clear-night':
                url = 'src/imgs/clear-night.svg';
                break;
            case 'cloudy':
                url = 'src/imgs/cloudy.svg';
                break;
            case 'fog':
                url = 'src/imgs/fog.svg';
                break;
            case 'hail':
                url = 'src/imgs/hail.svg';
                break;
            case 'partly-cloudy-day':
                url = 'src/imgs/partly-cloudy-day.svg';
                break;
            case 'partly-cloudy-night':
                url = 'src/imgs/partly-cloudy-night.svg';
                break;
            case 'rain-snow-showers-day':
                url = 'src/imgs/rain-snow-showers-day.svg';
                break;
            case 'rain-snow-showers-night':
                url = 'src/imgs/rain-snow-showers-night.svg';
                break;
            case 'rain-snow':
                url = 'src/imgs/rain-snow.svg';
                break;
            case 'rain':
                url = 'src/imgs/rain.svg';
                break;
            case 'showers-day':
                url = 'src/imgs/showers-day.svg';
                break;
            case 'showers-night':
                url = 'src/imgs/showers-night.svg';
                break;
            case 'sleet':
                url = 'src/imgs/sleet.svg';
                break;
            case 'snow-showers-day':
                url = 'src/imgs/snow-showers-day.svg';
                break;
            case 'snow-showers-night':
                url = 'src/imgs/snow-showers-night.svg';
                break;
            case 'snow':
                url = 'src/imgs/snow.svg';
                break;
            case 'thunder-rain':
                url = 'src/imgs/thunder-rain.svg';
                break;
            case 'thunder-showers-day':
                url = 'src/imgs/thunder-showers-day.svg';
                break;
            case 'thunder-showers-night':
                url = 'src/imgs/thunder-showers-night.svg';
                break;
            case 'thunder':
                url = 'src/imgs/thunder.svg';
                break;
            case 'wind':
                url = 'src/imgs/wind.svg';
                break;
            default:
                url = 'src/imgs/default.svg'; // Fallback for unmatched weather types
                break;
        }

        image.src = url;
        console.log(image.src);
        return image;
  }
