// weather.js

export { getWeatherDataCityCountry, getWeatherDataGeoLocation}

const getWeatherDataCityCountry = async function(){
    const location = readLocationSearch();

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

    console.log(`${APIrequestURL + location.city},${location.country}?key=${key}`)

    const response = await fetch(`${APIrequestURL + location.city},${location.country}?key=${key}`, {mode: "cors"})
        .catch(onFailure);
    const geoData = await response.json();
    
    return geoData;
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

const getWeatherDataGeoLocation = async function(){
    const locationData = await shareLocation();
    console.log(locationData);

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    
    console.log(`${APIrequestURL + locationData.latitude},${locationData.longitude}?unitGroup=metric&key=${key}`);

    const response = await fetch(`${APIrequestURL + locationData.latitude},${locationData.longitude}?key=${key}`, {mode: "cors"});
    const weatherData = await response.json();

    return weatherData;

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

