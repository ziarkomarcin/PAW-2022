import { App } from './app';
import './main.scss';


let addToCityList = document.getElementById("button-to-add");
let showCities = document.getElementById("show-cities-div");

addToCityList.addEventListener('click', () => {
    let city_name = app.getEnteredCity();
    
    if(app.arrayCities.includes(city_name) || app.citiesFromLocalStorage().includes(city_name)){
        return;
        // ^ if array in app includes entered CityName OR it is saved in LocalStorage
    }else{
        app.getCityInfo(city_name).then(data => {
            showCities.appendChild(app.renderCityBox(data, city_name));
            // else create box in show-cities-div based on data & city_name
        })
        app.createArrayOfCities(city_name);
    }
});

window.addEventListener('load', () => {
    let cities: string[] = app.citiesFromLocalStorage();
    // ^ get cities from localStorage
    if(cities){
        cities.forEach((city, countCity) => {
            app.getCityInfo(city).then(data => {
                // ^ if there are cities saved in localStorage then =>
                showCities.appendChild(app.renderCityBox(data,cities[countCity]));
                // ^ create box with info about weather in that city...
            })
        });
    }
});

window.addEventListener('beforeunload', function() {
    app.createLocalStorageCities(app.arrayCities);
/* 
    ^ when you want to close the browser 
      then save cities from array in LocalStorage
*/
});

const app = new App();
