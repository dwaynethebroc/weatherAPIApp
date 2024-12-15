// weather.js

export { getWeatherDataCityCountry, getWeatherDataGeoLocation}

const getWeatherDataCityCountry = async function(){
    const location = readLocationSearch();
    const city = location.city;
    const country = location.country;

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

    console.log(`${APIrequestURL + city},${country}?key=${key}`)

    const response = await fetch(`${APIrequestURL + city},${country}?key=${key}`, {mode: "cors"})
        .catch(onFailure);
    const geoData = await response.json();
    
    return geoData;
}

const shareLocation = async function(){
    const latLongData = {};
    
    navigator.geolocation.getCurrentPosition((position) => {
            latLongData.latitude = position.coords.latitude;
            latLongData.longitude = position.coords.longitude;

            console.log(latLongData);
        });

    return latLongData;
}

const getWeatherDataGeoLocation = async function(){
    const locationData = await shareLocation(); 

    console.log(locationData.latitude);
    console.log(locationData.longitude);

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    console.log(`${APIrequestURL + locationData.latitude},${locationData.longitude}?unitGroup=metric&key=${key}`);

    const response = await fetch(`${APIrequestURL + locationData.latitude},${locationData.longitude}?key=${key}`, {mode: "cors"});
    const weatherData = await response.json();

    console.log(weatherData);
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

const fetchRequestDataLocation = function(){
    const geoData = shareLocation
                        .then(getWeatherDataGeoLocation);

}

