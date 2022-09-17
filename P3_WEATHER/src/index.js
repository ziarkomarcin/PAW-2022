"use strict";
exports.__esModule = true;
var app_1 = require("./app");
require("./main.scss");
var addToCityList = document.getElementById("button-to-add");
var showCities = document.getElementById("show-cities-div");
addToCityList.addEventListener('click', function () {
    var city_name = app.getEnteredCity();
    if (app.arrayCities.includes(city_name) || app.citiesFromLocalStorage().includes(city_name)) {
        return;
        // ^ if array in app includes entered CityName OR it is saved in LocalStorage
    }
    else {
        app.getCityInfo(city_name).then(function (data) {
            showCities.appendChild(app.renderCityBox(data, city_name));
            // else create box in show-cities-div based on data & city_name
        });
        app.createArrayOfCities(city_name);
    }
});
window.addEventListener('load', function () {
    var cities = app.citiesFromLocalStorage();
    // ^ get cities from localStorage
    if (cities) {
        cities.forEach(function (city, countCity) {
            app.getCityInfo(city).then(function (data) {
                // ^ if there are cities saved in localStorage then =>
                showCities.appendChild(app.renderCityBox(data, cities[countCity]));
                // ^ create box with info about weather in that city...
            });
        });
    }
});
window.addEventListener('beforeunload', function () {
    app.createLocalStorageCities(app.arrayCities);
    /*
        ^ when you want to close the browser
          then save cities from array in LocalStorage
    */
});
var app = new app_1.App();
