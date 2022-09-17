import { IWeatherData, IWeather } from './inter';

export class App {
    opwApiKey = 'cee0399a2098bebcbc13c9ef29cbbf7d';
    arrayCities: string[] = [];
    id: number = 0;

    async getCityInfo(city: string) {
        const weather = await this.getWeather(city);
        this.saveData(weather);
        return weather;
    }

    async getWeather(city: string): Promise<IWeatherData> {
        const openWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${this.opwApiKey}`;
        const weatherResponse = await fetch(openWeatherUrl);
        const weatherData = await weatherResponse.json();
        return weatherData;
    }

    saveData(data: any) {
        localStorage.setItem('weatherData', JSON.stringify(data));
    }
    
    getData() {
        const data = localStorage.getItem('weatherData');
        if (data) {
            return JSON.parse(data);
        } 
        else 
        {
            return {};
        }
    }
    // ^ pobrane z PAW-niestac-2021
    
    createLocalStorageCities(cities: string[]){
        if(cities == []){
            return;
        }else{
            let cityData: string[] = this.citiesFromLocalStorage();
            if(cityData){
                cityData.forEach(element => {
                    cities.push(element);
                });
            }
            localStorage.setItem('cityData', JSON.stringify(cities));
        }
    }
    // ^ dane miast w localStorage

    citiesFromLocalStorage(){
        const cityData = localStorage.getItem('cityData');
        if (cityData) {
            return JSON.parse(cityData);
        } 
        else 
        {
            return;
        }
    }
    // ^ getting Cities from localStorage
    
    getEnteredCity(){
        let get = (<HTMLInputElement>document.getElementById("city-enter")).value;
        let got = get.toLowerCase();
        return got;
    }
    // ^ getting names of cities entered in input

    createArrayOfCities(got: string){
        
        if(this.arrayCities.includes(got)){
            return;
        }else{
            this.arrayCities.push(got);
        }
    }
    // ^ creating array of cities from function getEnteredCity() above


/*
        <--- RENDERING CITY BOXES --->
*/
    renderCityBox(weather: IWeatherData,city_name: string){

        // new cityBox
        let cityBox: HTMLDivElement = document.createElement("div");
        cityBox.id = "cityBox" + this.id;
        cityBox.className = "cityBox";

        // city name -> nazwa miasta
        let name_cityBox: HTMLDivElement = document.createElement("div");
        name_cityBox.className = "name_cityBox";
        name_cityBox.innerHTML = city_name;

        // status of the sky -> status nieba
        let sky_cityBox: HTMLDivElement = document.createElement("div");
        sky_cityBox.className = "sky_cityBox";
        sky_cityBox.innerHTML = weather.weather[0].main;

        // div under city name & sky status
        let half_div: HTMLDivElement = document.createElement("div");
        half_div.className = "half_div";

        // temperature -> temperatura
        let temperature_cityBox: HTMLDivElement = document.createElement("div");
        temperature_cityBox.className = "temperature_cityBox";
        temperature_cityBox.innerHTML = weather.main.temp + "°C"
        temperature_cityBox.style.backgroundImage = `url(http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png)`;
        temperature_cityBox.style.backgroundRepeat = "no-repeat";
        temperature_cityBox.style.backgroundSize = "auto";

        //div created for pressure & humidity
        let dual_div: HTMLDivElement = document.createElement("div");
        dual_div.className = "dual_div";

        // pressure -> ciśnienie
        let pressure_cityBox: HTMLDivElement = document.createElement("div");
        pressure_cityBox.className = "pressure_cityBox";
        pressure_cityBox.innerHTML = "<p>ciśnienie: <p>" + weather.main.pressure.toString() + " hPa";

        // humidity -> wilgotność
        let humidity_cityBox: HTMLDivElement = document.createElement("div");
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
    }
}
