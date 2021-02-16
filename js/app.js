let latitude;
let longitude;

let cityDescriptionQuerySelector = document.querySelector('#left-today-description > p')
let dateDescriptionQuerySelector = document.querySelector('#left-today-description > h1')
let weatherDescriptionQuerySelector = document.querySelector('#center-icon-temp-description > p')
let weatherRealTempQuerySelector = document.querySelector('#right-real-temperature > h1')
let feelsLikeTempQuerySelector = document.querySelector('#right-real-temperature > p')
let dayOfWeekQuerySelector = document.querySelectorAll('#weekdays > div > h1')

getLocation();

function getLocation() {

    window.addEventListener('load', () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                const apiKey = "c9844fc7cf52401cb9ca1af55ae1194a"
                const url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`

                fetch(url)
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        //console.log(data)
                        let cityName = data.data[0].city_name;
                        let countryCode = data.data[0].country_code;
                        let realTemp = data.data[0].temp;
                        let feelsLike = data.data[0].app_temp;

                        dateDescriptionQuerySelector.textContent = moment().format('dddd' + ', ' + 'DD')
                        cityDescriptionQuerySelector.textContent = "Today in " + cityName + ", " + countryCode;
                        weatherDescriptionQuerySelector.textContent = data.data[0].weather.description;
                        weatherRealTempQuerySelector.textContent = Math.floor(realTemp) + "ºC";
                        feelsLikeTempQuerySelector.textContent = "Feels like " + Math.floor(feelsLike) + "ºC";

                        const urlSevenDays = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&units=M&key=${apiKey}`
                        fetch(urlSevenDays)
                            .then(response => {
                                return response.json()
                            })
                            .then(data => {
                                //console.log(data)
                            })
                    })
            })
            iterateForecast();
        } else {
            console.log("Location not available.")
        }
    })

};

function iterateForecast() {
    var days = new Array();
    days[0] = "SUN";
    days[1] = "MON";
    days[2] = "TUE";
    days[3] = "WED";
    days[4] = "THU";
    days[5] = "FRI";
    days[6] = "SAT";

    for (let i = 0; i < days.length; i++) {
        for (let i = 0; i < dayOfWeekQuerySelector.length; i++) {
            dayOfWeekQuerySelector[i].textContent = days[i];
        }
    }

    

}