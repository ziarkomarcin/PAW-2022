"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.App = void 0;
var App = /** @class */ (function () {
    function App() {
        this.opwApiKey = 'cee0399a2098bebcbc13c9ef29cbbf7d';
        this.arrayCities = [];
        this.id = 0;
    }
    App.prototype.getCityInfo = function (city) {
        return __awaiter(this, void 0, void 0, function () {
            var weather;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWeather(city)];
                    case 1:
                        weather = _a.sent();
                        this.saveData(weather);
                        return [2 /*return*/, weather];
                }
            });
        });
    };
    App.prototype.getWeather = function (city) {
        return __awaiter(this, void 0, void 0, function () {
            var openWeatherUrl, weatherResponse, weatherData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=" + this.opwApiKey;
                        return [4 /*yield*/, fetch(openWeatherUrl)];
                    case 1:
                        weatherResponse = _a.sent();
                        return [4 /*yield*/, weatherResponse.json()];
                    case 2:
                        weatherData = _a.sent();
                        return [2 /*return*/, weatherData];
                }
            });
        });
    };
    App.prototype.saveData = function (data) {
        localStorage.setItem('weatherData', JSON.stringify(data));
    };
    App.prototype.getData = function () {
        var data = localStorage.getItem('weatherData');
        if (data) {
            return JSON.parse(data);
        }
        else {
            return {};
        }
    };
    // ^ whole code imported from github repo PAW-niestac-2021
    App.prototype.createLocalStorageCities = function (cities) {
        if (cities == []) {
            return;
        }
        else {
            var cityData = this.citiesFromLocalStorage();
            if (cityData) {
                cityData.forEach(function (element) {
                    cities.push(element);
                });
            }
            localStorage.setItem('cityData', JSON.stringify(cities));
        }
    };
    // ^ creating data of Cities in localStorage
    App.prototype.citiesFromLocalStorage = function () {
        var cityData = localStorage.getItem('cityData');
        if (cityData) {
            return JSON.parse(cityData);
        }
        else {
            return;
        }
    };
    // ^ getting Cities from localStorage
    App.prototype.getEnteredCity = function () {
        var get = document.getElementById("city-enter").value;
        var got = get.toLowerCase();
        return got;
    };
    // ^ getting names of cities entered in input
    App.prototype.createArrayOfCities = function (got) {
        if (this.arrayCities.includes(got)) {
            return;
        }
        else {
            this.arrayCities.push(got);
        }
    };
    // ^ creating array of cities from function getEnteredCity() above
    /*
            <--- RENDERING CITY BOXES --->
    */
    App.prototype.renderCityBox = function (weather, city_name) {
        // new cityBox
        var cityBox = document.createElement("div");
        cityBox.id = "cityBox" + this.id;
        cityBox.className = "cityBox";
        // city name -> nazwa miasta
        var name_cityBox = document.createElement("div");
        name_cityBox.className = "name_cityBox";
        name_cityBox.innerHTML = city_name;
        // status of the sky -> status nieba
        var sky_cityBox = document.createElement("div");
        sky_cityBox.className = "sky_cityBox";
        sky_cityBox.innerHTML = weather.weather[0].main;
        // div under city name & sky status
        var half_div = document.createElement("div");
        half_div.className = "half_div";
        // temperature -> temperatura
        var temperature_cityBox = document.createElement("div");
        temperature_cityBox.className = "temperature_cityBox";
        temperature_cityBox.innerHTML = weather.main.temp + "°C";
        temperature_cityBox.style.backgroundImage = "url(http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png)";
        temperature_cityBox.style.backgroundRepeat = "no-repeat";
        temperature_cityBox.style.backgroundSize = "auto";
        //div created for pressure & humidity
        var dual_div = document.createElement("div");
        dual_div.className = "dual_div";
        // pressure -> ciśnienie
        var pressure_cityBox = document.createElement("div");
        pressure_cityBox.className = "pressure_cityBox";
        pressure_cityBox.innerHTML = "<p>ciśnienie: <p>" + weather.main.pressure.toString() + " hPa";
        // humidity -> wilgotność
        var humidity_cityBox = document.createElement("div");
        humidity_cityBox.className = "humidity_cityBox";
        humidity_cityBox.innerHTML = "<p>wilgotność: <p>" + weather.main.humidity.toString() + "%";
        cityBox.appendChild(name_cityBox);
        cityBox.appendChild(sky_cityBox);
        cityBox.appendChild(half_div);
        half_div.appendChild(temperature_cityBox);
        half_div.appendChild(dual_div);
        dual_div.appendChild(pressure_cityBox);
        dual_div.appendChild(humidity_cityBox);
        this.id++;
        return cityBox;
        // RENDERED!
    };
    return App;
}());
exports.App = App;
