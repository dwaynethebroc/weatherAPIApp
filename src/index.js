import "./styles.css";
import { verifyString, getWeatherDataGeoLocation} from "./weather.js";

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', verifyString);

const shareLocationButton = document.getElementById('shareLocation');
shareLocationButton.addEventListener('click', getWeatherDataGeoLocation);