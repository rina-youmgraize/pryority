const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const cityNameElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const conditionTextElement = document.getElementById('condition-text');
const conditionIconElement = document.getElementById('condition-icon');
const weatherInfoDiv = document.getElementById('weather-info');
const errorMessageElement = document.getElementById('error-message');
const forecastContainer = document.getElementById('forecast-container');
const detailedForecastDiv = document.getElementById('detailed-forecast');
const detailedDayNameElement = document.getElementById('detailed-day-name');
const detailedDateElement = document.getElementById('detailed-date');
const hourlyForecastDiv = document.getElementById('hourly-forecast');
const currentDateElement = document.getElementById('current-date');

const apiKey = '9ac40066f7fb49f1b2d64908250205';
const lastSearchedCityKey = 'lastSearchedCity';
const weatherDataKey = 'weatherData';

window.addEventListener('load', () => {
    const lastCity = localStorage.getItem(lastSearchedCityKey);
    const storedWeatherData = localStorage.getItem(weatherDataKey);
    if (lastCity) {
        cityInput.value = lastCity;
    }
    if (storedWeatherData) {
        try {
            const weatherData = JSON.parse(storedWeatherData);
            displayWeatherData(weatherData);
        } catch (error) {
            console.error('Error parsing stored weather data:', error);
            localStorage.removeItem(weatherDataKey);
        }
    }
});

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        localStorage.setItem(lastSearchedCityKey, city);
        fetchWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

async function fetchWeatherData(city) {
    weatherInfoDiv.classList.add('hidden');
    errorMessageElement.classList.add('hidden');
    forecastContainer.innerHTML = '';
    detailedForecastDiv.classList.add('hidden');
    hourlyForecastDiv.innerHTML = '';
    fullForecastData = [];
    currentDateElement.textContent = '';

    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            errorMessageElement.textContent = data.error.message;
            errorMessageElement.classList.remove('hidden');
            localStorage.removeItem(weatherDataKey);
        } else {
            localStorage.setItem(weatherDataKey, JSON.stringify(data));
            displayWeatherData(data);
        }
    } catch (error) {
        console.error('שגיאה בפנייה ל-API:', error);
        errorMessageElement.textContent = 'אירעה שגיאה בעת שליפת נתוני מזג האוויר.';
        errorMessageElement.classList.remove('hidden');
        localStorage.removeItem(weatherDataKey);
    } finally {
        cityInput.value = '';
    }
}

function displayWeatherData(data) {
    cityNameElement.textContent = data.location.name;
    const now = new Date(data.location.localtime);
    const formattedDate = new Intl.DateTimeFormat('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(now);
    currentDateElement.textContent = formattedDate;
    temperatureElement.textContent = `טמפרטורה: ${data.current.temp_c}°C`;
    conditionTextElement.textContent = data.current.condition.text;
    conditionIconElement.src = data.current.condition.icon;
    weatherInfoDiv.classList.remove('hidden');
    fullForecastData = data.forecast.forecastday;
    forecastContainer.innerHTML = '';

    fullForecastData.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = new Intl.DateTimeFormat('he-IL', {
            weekday: 'short'
        }).format(date);
        const formattedDayDate = new Intl.DateTimeFormat('he-IL', {
            day: 'numeric',
            month: 'short'
        }).format(date);
        const iconUrl = day.day.condition.icon;
        const minTemp = day.day.mintemp_c;
        const maxTemp = day.day.maxtemp_c;
        const forecastDayElement = document.createElement('div');
        forecastDayElement.classList.add('forecast-day');
        forecastDayElement.dataset.dayIndex = index;
        forecastDayElement.addEventListener('click', showDetailedForecast);
        forecastDayElement.innerHTML = `
                    <div class="day-name">${dayName}</div>
                    <div class="date">${formattedDayDate}</div>
                    <img src="${iconUrl}" alt="מצב מזג האוויר" class="forecast-icon">
                    <div class="min-temp">Min: ${minTemp}°C</div>
                    <div class="max-temp">Max: ${maxTemp}°C</div>
                `;
        forecastContainer.appendChild(forecastDayElement);
    });
    adjustBorderWidth();
}


function showDetailedForecast(event) {
    const dayIndex = event.currentTarget.dataset.dayIndex;
    const selectedDayData = fullForecastData[dayIndex];

    if (selectedDayData) {
        const date = new Date(selectedDayData.date);
        const fullDayName = new Intl.DateTimeFormat('he-IL', {
            weekday: 'long'
        }).format(date);
        const fullDate = new Intl.DateTimeFormat('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
        detailedDayNameElement.textContent = fullDayName;
        detailedDateElement.textContent = fullDate;
        hourlyForecastDiv.innerHTML = '';

        selectedDayData.hour.forEach(hourData => {
            const time = new Date(hourData.time).toLocaleTimeString('he-IL', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const iconUrl = hourData.condition.icon;
            const tempC = hourData.temp_c;
            const hourlyItem = document.createElement('div');
            hourlyItem.classList.add('hourly-item');
            hourlyItem.innerHTML = `
                <div class="hourly-time">${time}</div>
                <img src="${iconUrl}" alt="מצב מזג האוויר" class="hourly-icon">
                <div class="hourly-temp">${tempC}°C</div>
            `;
            hourlyForecastDiv.appendChild(hourlyItem);
        });

        detailedForecastDiv.classList.remove('hidden');
        detailedForecastDiv.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function adjustBorderWidth() {
    const screenWidth = window.innerWidth;
    let borderWidth = '0px';
    if (screenWidth >= 1200) {
        borderWidth = '5px';
    } else if (screenWidth >= 768) {
        borderWidth = '3px';
    } else {
        borderWidth = '1px';
    }
    weatherInfoDiv.style.borderWidth = borderWidth;
    weatherInfoDiv.style.borderStyle = 'solid';
    weatherInfoDiv.style.borderColor = 'rgba(255, 255, 255, 0.3)';
}
window.addEventListener('resize', adjustBorderWidth);