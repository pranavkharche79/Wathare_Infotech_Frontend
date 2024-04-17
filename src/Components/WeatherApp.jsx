import React, { useState, useEffect } from "react";

const WeatherApp = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = "636aa1b51cb78759e8fc88c3edaf8af9";

  useEffect(() => {
    // Fetch current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError("Error getting location. Please enable location services.");
        console.error("Error getting location:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      // Fetch weather data
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeatherData(data.list[0]);
    } catch (error) {
      setError("Failed to fetch weather data. Please try again later.");
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {weatherData ? (
            <div>
              <h2>Current Weather</h2>
              <p>
                <strong>Temperature: </strong>
                {weatherData.main.temp}°C
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          {location.latitude && location.longitude && (
            <p>
              <strong> Your current location:</strong> {location.latitude},{" "}
              {location.longitude}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherApp;
