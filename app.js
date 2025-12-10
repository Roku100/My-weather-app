// API Configuration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get free key from openweathermap.org
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const locationInput = document.getElementById('locationInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

// ==========================================
// 1. API Functions - Fetch Weather Data
// ==========================================

/**
 * Fetch geographic coordinates from location name
 * @param {string} location - City name or location
 * @returns {Promise<Object>} - Coordinates {lat, lon}
 */
async function fetchCoordinates(location) {
    try {
        const response = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error('Location not found');

        const data = await response.json();
        if (data.length === 0) throw new Error('Location not found');

        console.log('Coordinates fetched:', data[0]);
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name,
            country: data[0].country
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}

/**
 * Fetch current weather data for given coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Weather data
 */
async function fetchCurrentWeather(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch weather');

        const data = await response.json();
        console.log('Current weather fetched:', data);
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
}

/**
 * Fetch 5-day weather forecast
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Forecast data
 */
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch forecast');

        const data = await response.json();
        console.log('Forecast fetched:', data);
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

// ==========================================
// 2. Data Processing Functions
// ==========================================

/**
 * Process current weather data and extract required information
 * @param {Object} rawData - Raw weather data from API
 * @param {Object} coords - Location coordinates
 * @returns {Object} - Processed weather object
 */
function processCurrentWeather(rawData, coords) {
    const processed = {
        location: `${rawData.name}, ${rawData.sys.country}`,
        temperature: Math.round(rawData.main.temp),
        feelsLike: Math.round(rawData.main.feels_like),
        description: rawData.weather[0].description,
        icon: rawData.weather[0].main.toLowerCase(),
        humidity: rawData.main.humidity,
        windSpeed: Math.round(rawData.wind.speed * 3.6), // Convert m/s to km/h
        pressure: rawData.main.pressure,
        visibility: Math.round(rawData.visibility / 1000), // Convert to km
        uvIndex: 'N/A', // Will be fetched separately if needed
        timestamp: new Date(rawData.dt * 1000)
    };

    console.log('Processed current weather:', processed);
    return processed;
}

/**
 * Process forecast data and extract daily forecasts
 * @param {Object} rawData - Raw forecast data from API
 * @returns {Array} - Array of processed daily forecasts
 */
function processForecast(rawData) {
    const dailyForecasts = {};

    // Group by day
    rawData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toDateString();

        if (!dailyForecasts[day]) {
            dailyForecasts[day] = {
                date: date,
                temps: [],
                descriptions: [],
                icon: item.weather[0].main.toLowerCase(),
                humidity: item.main.humidity
            };
        }

        dailyForecasts[day].temps.push(item.main.temp);
        dailyForecasts[day].descriptions.push(item.weather[0].main);
    });

    // Convert to array and calculate daily stats
    const forecast = Object.values(dailyForecasts).slice(0, 5).map(day => ({
        date: day.date,
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        icon: day.icon,
        description: day.descriptions[0]
    }));

    console.log('Processed forecast:', forecast);
    return forecast;
}

// ==========================================
// 3. Weather Icon Handler with Dynamic Import
// ==========================================

/**
 * Get weather icon dynamically
 * @param {string} weatherType - Weather condition type
 * @returns {string} - Path to weather icon
 */
async function getWeatherIcon(weatherType) {
    try {
        // Dynamic import of weather icons based on condition
        const iconMap = {
            'clear': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'drizzle': '🌦️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️',
            'smoke': '💨',
            'haze': '🌫️',
            'dust': '🌪️',
            'fog': '🌫️',
            'sand': '🌪️',
            'ash': '💨',
            'squall': '💨',
            'tornado': '🌪️'
        };

        return iconMap[weatherType] || '🌤️';
    } catch (error) {
        console.error('Error loading weather icon:', error);
        return '🌤️';
    }
}

/**
 * Get weather emoji for small displays
 */
function getWeatherEmoji(weatherType) {
    const emojiMap = {
        'clear': '☀️',
        'clouds': '☁️',
        'rain': '🌧️',
        'drizzle': '🌦️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
        'smoke': '💨',
        'haze': '🌫️',
        'dust': '🌪️',
        'fog': '🌫️',
        'sand': '🌪️',
        'ash': '💨',
        'squall': '💨',
        'tornado': '🌪️'
    };

    return emojiMap[weatherType] || '🌤️';
}

// ==========================================
// 4. UI Display Functions
// ==========================================

/**
 * Display weather information on webpage
 * @param {Object} weatherData - Processed weather data
 * @param {Array} forecastData - Processed forecast data
 */
function displayWeather(weatherData, forecastData) {
    // Update main weather display
    document.getElementById('locationName').textContent = weatherData.location;
    document.getElementById('currentDate').textContent = 
        weatherData.timestamp.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    
    document.getElementById('temperature').textContent = `${weatherData.temperature}°C`;
    document.getElementById('description').textContent = weatherData.description;
    document.getElementById('feelsLike').textContent = `${weatherData.feelsLike}°C`;
    document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
    document.getElementById('windSpeed').textContent = `${weatherData.windSpeed} km/h`;
    document.getElementById('pressure').textContent = `${weatherData.pressure} mb`;
    document.getElementById('visibility').textContent = `${weatherData.visibility} km`;
    document.getElementById('uvIndex').textContent = weatherData.uvIndex;

    // Set weather icon
    document.getElementById('weatherIcon').textContent = getWeatherEmoji(weatherData.icon);

    // Display forecast
    displayForecast(forecastData);

    // Show weather display
    hideError();
    hideLoading();
    showWeatherDisplay();
}

/**
 * Display 5-day forecast
 * @param {Array} forecastData - Forecast data array
 */
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    forecastData.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        const date = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const emoji = getWeatherEmoji(day.icon);

        forecastItem.innerHTML = `
            <div class="forecast-date">${date}</div>
            <div class="forecast-icon">${emoji}</div>
            <div class="forecast-temp">${day.high}° / ${day.low}°</div>
            <div class="forecast-condition">${day.description}</div>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

// ==========================================
// 5. Error Handling & UI Controls
// ==========================================

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.add('hidden');
}

/**
 * Show loading spinner
 */
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

/**
 * Show weather display
 */
function showWeatherDisplay() {
    weatherDisplay.classList.remove('hidden');
}

/**
 * Hide weather display
 */
function hideWeatherDisplay() {
    weatherDisplay.classList.add('hidden');
}

// ==========================================
// 6. Main Handler
// ==========================================

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleSearch(event) {
    event.preventDefault();
    
    const location = locationInput.value.trim();
    if (!location) return;

    // Check if API key is set
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
        showError('❌ Error: Please set your OpenWeatherMap API key in app.js');
        console.error('API_KEY not configured. Get a free key from https://openweathermap.org/api');
        return;
    }

    try {
        showLoading();
        hideError();

        // Fetch geographic coordinates
        const coords = await fetchCoordinates(location);

        // Fetch current weather and forecast
        const [currentWeatherData, forecastData] = await Promise.all([
            fetchCurrentWeather(coords.lat, coords.lon),
            fetchForecast(coords.lat, coords.lon)
        ]);

        // Process data
        const weatherData = processCurrentWeather(currentWeatherData, coords);
        const forecast = processForecast(forecastData);

        // Display results
        displayWeather(weatherData, forecast);

        // Clear input
        locationInput.value = '';

    } catch (error) {
        hideLoading();
        hideWeatherDisplay();
        showError(`❌ ${error.message}`);
        console.error('Search error:', error);
    }
}

// ==========================================
// 7. Initialize on Page Load
// ==========================================

window.addEventListener('load', () => {
    console.log('Weather app loaded successfully!');
    console.log('Remember to set your API_KEY from https://openweathermap.org/api');
    hideLoading();
    hideWeatherDisplay();
});
