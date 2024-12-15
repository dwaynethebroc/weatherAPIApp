import "./styles.css";
import { getWeatherDataCityCountry, getWeatherDataGeoLocation} from "./weather.js";

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', getWeatherDataCityCountry);

const shareLocationButton = document.getElementById('shareLocation');
shareLocationButton.addEventListener('click', getWeatherDataGeoLocation);