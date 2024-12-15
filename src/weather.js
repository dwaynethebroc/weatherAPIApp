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
        .catch(onFailure(err));
    const geoData = await response.json();
    
    return geoData;
}

const shareLocation = function(){
    const latLongData = {};

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            latLongData.latitude = position.coords.latitude;
            latLongData.longitude = position.coords.longitude;

            console.log(latLongData);

            return latLongData;
        });
    } else {
        console.error("Location sharing is off");
    }

    
}

const getWeatherDataGeoLocation = function(){

    console.log(locationData);

    const key = "P7RMSP9B8LK52KS5VP79GS5TB";
    const APIrequestURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    console.log(`${APIrequestURL + locationData.latitude},${locationData.longitude}?key=${key}`)

    const response = await fetch(`${APIrequestURL + locationData.latitude},${locationData.longitude}?key=${key}`, {mode: "cors"})
        .catch(onFailure(err));
    const weatherData = await response.json();

}

const readLocationSearch = function(){
    const searchInput = document.getElementById('locationSearch');

    const searchInputData = searchInput.value.split(',');
    const city = searchInputData[0].trim();
    const country = searchInputData[1].trim();

    searchInput.value = '';

    const location = {city, country}
    return location
}

const onFailure = function(err){
    console.error(err)
}

