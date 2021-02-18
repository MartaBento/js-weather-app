const apiKey = "c9844fc7cf52401cb9ca1af55ae1194a"

let latitude;
let longitude;

let cityDescriptionQuerySelector = document.querySelector('#left-today-description > p')
let dateDescriptionQuerySelector = document.querySelector('#left-today-description > h1')
let weatherDescriptionQuerySelector = document.querySelector('#center-icon-temp-description > p')
let weatherRealTempQuerySelector = document.querySelector('#right-real-temperature > h1')
let feelsLikeTempQuerySelector = document.querySelector('#right-real-temperature > p')
let dayOfWeekQuerySelector = document.querySelectorAll('#weekdays > div > h1')
let dayForecastQuerySelector = document.querySelectorAll('#weekdays > div > h2')
let descriptionForecastQuerySelector = document.querySelectorAll('#weekdays > div > h3')
let tempForecastWeekQuerySelector = document.querySelectorAll('#weekdays > div > p')
let iconForecastWeekQuerySelector = document.querySelectorAll('#icon')

let weekDays = [];
let calendarDays = [];
let temp = [];
let description = [];
let nrDaysToIterate = 7;

getLocation();

function getLocation() {

    window.addEventListener('load', () => {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(position => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

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
                        weatherRealTempQuerySelector.textContent = Math.round(realTemp) + "ºC";
                        feelsLikeTempQuerySelector.textContent = "Feels like " + Math.round(feelsLike) + "ºC";

                        /* iterates through the next 7 days, using moment.js lib */

                        for (let i = 1; i <= nrDaysToIterate; i++) {
                            weekDays.push(moment().add(i, 'days').format('dddd'));
                            calendarDays.push(moment().add(i, 'days').format('D/MM'));
                        }

                        for (let i = 0; i < weekDays.length; i++) {
                            for (let i = 0; i < dayOfWeekQuerySelector.length; i++) {
                                dayOfWeekQuerySelector[i].textContent = weekDays[i];
                                dayForecastQuerySelector[i].textContent = calendarDays[i];
                            }
                        }

                        /* iterates through the next 7 days to retrieve the weather info for next week */
                        let forecastWeek = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&units=M&key=${apiKey}`

                        fetch(forecastWeek)
                            .then(response => {
                                return response.json()
                            })
                            .then(data => {
                                //console.log(data)

                                /* retrieves the icons information and populate the DOM */
                                for (let i = 1; i <= weekDays.length; i++) {
                                    for (let i = 0; i < iconForecastWeekQuerySelector.length; i++) {
                                        let imgCode = data.data[i].weather.icon;
                                        iconForecastWeekQuerySelector[i].src = `https://www.weatherbit.io/static/img/icons/${imgCode}.png`
                                    }
                                }

                                /* retrieves the forecast information for the next week */
                                for (let i = 1; i <= nrDaysToIterate; i++) {
                                    temp.push(Math.round(data.data[i].low_temp) + "/" + Math.round(data.data[i].high_temp));
                                    description.push(data.data[i].weather.description);
                                }

                                for (let i = 0; i < weekDays.length; i++) {
                                    for (let i = 0; i < tempForecastWeekQuerySelector.length; i++) {
                                        tempForecastWeekQuerySelector[i].textContent = temp[i] + "ºC";
                                        descriptionForecastQuerySelector[i].textContent = description[i];
                                    }
                                }
                            })
                    })
            })
        } else {
            console.log("Location not available.")
        }
    })
};