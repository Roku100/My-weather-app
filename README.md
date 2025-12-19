# Weather App - The Odin Project

A fully functional weather application that fetches real-time weather data and displays it beautifully on your webpage.

## Features

✅ **Search by Location** - Enter any city name to get current weather  
✅ **Real-time Weather Data** - Current conditions, temperature, humidity, wind speed, and more  
✅ **5-Day Forecast** - View upcoming weather conditions  
✅ **Loading Component** - Visual feedback while fetching data  
✅ **Error Handling** - User-friendly error messages  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Dynamic Icons** - Weather emojis that change based on conditions  
✅ **Beautiful UI** - Modern gradient design with smooth animations

## Setup Instructions

### 1. Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your free API key from the dashboard
4. Copy your API key

### 2. Configure the App

Open `app.js` and replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key:

```javascript
const API_KEY = "your_actual_api_key_here";
```

### 3. Run the App

Open `index.html` in your web browser by:

- Double-clicking the file, or
- Using a live server extension (recommended for better development experience)

## How to Use

1. Enter a city name in the search box
2. Click "Search" or press Enter
3. View the current weather and 5-day forecast
4. The loading spinner shows while fetching data

## Files Included

- `index.html` - Main HTML structure with form and weather display
- `styles.css` - Complete styling with responsive design
- `app.js` - All JavaScript logic for API calls and data processing
- `README.md` - This file

## API Functions

### `fetchCoordinates(location)`

Converts a location name to latitude/longitude coordinates.

### `fetchCurrentWeather(lat, lon)`

Fetches current weather data for given coordinates.

### `fetchForecast(lat, lon)`

Fetches 5-day weather forecast.

### `processCurrentWeather(rawData, coords)`

Processes API response and extracts only needed data.

### `processForecast(rawData)`

Processes forecast data into daily summaries.

## Data Processed

The app displays:

- Location name and date
- Current temperature (°C)
- "Feels like" temperature
- Weather description
- Humidity percentage
- Wind speed (km/h)
- Atmospheric pressure
- Visibility distance
- 5-day forecast with high/low temperatures

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Optional Enhancements

The app includes a loading spinner that can be tested using:

1. Open DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" or "Slow 4G" from the throttle dropdown
4. Submit a search to see the loading component in action

## API Data

All data comes from the free OpenWeatherMap API. Each API call includes:

- `console.log()` outputs for debugging (check DevTools console)
- Proper error handling and user feedback
- Only necessary data is processed and displayed

## Notes

- The app uses metric units (Celsius, km/h, km)
- Weather icons are represented using emojis for simplicity and better compatibility
- API key is required for the app to function
- Free tier has rate limits (60 calls/minute)

## Troubleshooting

**"Location not found" error:**

- Make sure you entered a valid city name
- Try a different spelling or a larger city

**No data showing:**

- Check that your API key is correctly set in `app.js`
- Open DevTools console to see detailed error messages
- Check your internet connection

**API errors:**

- Verify your API key is active on openweathermap.org
- Check if you've exceeded the free tier rate limits
- Try again after a few moments

## Version

Built for The Odin Project - Weather App Assignment

## License

This project is open source and available for educational purposes.
