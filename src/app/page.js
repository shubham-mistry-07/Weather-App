'use client';

import { useState } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge } from 'lucide-react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // REPLACE THIS WITH YOUR REAL API KEY
  // Get your free API key from: https://openweathermap.org/appid
  const API_KEY = '4e1107709266b90668e1a20a34377a5f';

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    if (API_KEY === 'YOUR_API_KEY_HERE') {
      setError('Please add your OpenWeatherMap API key in the code!');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      // Get coordinates from city name
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) {
        throw new Error('API key invalid or not activated yet. Wait 10-30 minutes after creating your key.');
      }

      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        setError('City not found. Please try again with a different name.');
        setLoading(false);
        return;
      }

      if (!geoData[0] || !geoData[0].lat || !geoData[0].lon) {
        setError('Invalid location data. Please try a different city.');
        setLoading(false);
        return;
      }

      const { lat, lon } = geoData[0];

      // Get weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please check your API key.');
      setLoading(false);
      console.error('Weather API Error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🌤️ Weather App
          </h1>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={searchWeather}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={20} />
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Weather Display Card */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching real weather data...</p>
          </div>
        )}

        {weather && !loading && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-[slideUp_0.5s_ease-out]">
            {/* Location */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">
                {weather.name}, {weather.sys.country}
              </h2>
            </div>

            {/* Main Weather */}
            <div className="text-center mb-6">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
                className="w-32 h-32 mx-auto transform transition-transform duration-300 hover:scale-110 hover:rotate-12"
              />
              <p className="text-6xl font-bold text-gray-800 mb-2">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-xl text-gray-600 capitalize">
                {weather.weather[0].description}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Feels like {Math.round(weather.main.feels_like)}°C
              </p>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-500" size={20} />
                  <span className="text-gray-600 text-sm">Wind Speed</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {weather.wind.speed} m/s
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="text-blue-500" size={20} />
                  <span className="text-gray-600 text-sm">Humidity</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="text-blue-500" size={20} />
                  <span className="text-gray-600 text-sm">Pressure</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {weather.main.pressure} hPa
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 transform transition-all duration-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="text-blue-500" size={20} />
                  <span className="text-gray-600 text-sm">Visibility</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}