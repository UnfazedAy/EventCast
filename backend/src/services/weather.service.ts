// import { weatherAIClient } from "../clients/weather-ai-client";
// import { WeatherData } from "../interfaces/weather.interface";
// import { ResolvedLocation } from "../interfaces/location.interface";
// import { AppError } from "../utils/AppError";

// export class WeatherService {
//   async getWeather(
//     location: ResolvedLocation,
//     eventDate: string
//   ): Promise<WeatherData> {
//     const response = await weatherAIClient.get("/weather", {
//       params: {
//         lat: location.latitude,
//         lon: location.longitude,
//         days: eventDate,
//         units: "metric",
//       },
//     });

//     const weatherData: WeatherData = {
//       date: eventDate,
//       maxTemperature: response.data.daily.max_temperature,
//       minTemperature: response.data.daily.min_temperature,
//       precipitation: response.data.daily.precipitation,
//       windSpeed: response.data.daily.wind_speed,
//       weatherCode: response.data.daily.weather_code,
//     };

//     return weatherData;
//   }
// }

import { weatherAIClient } from "../clients/weather-ai-client";
import { WeatherData } from "../interfaces/weather.interface";
import { ResolvedLocation } from "../interfaces/location.interface";
import { AppError } from "../utils/AppError";

export class WeatherService {
  async getWeather(
    location: ResolvedLocation,
    eventDate: string
  ): Promise<WeatherData> {
    const { data } = await weatherAIClient.get("/weather", {
      params: {
        lat: location.latitude,
        lon: location.longitude,
        days: 7,
        units: "metric",
      },
    });

    const dailyForecast = data.daily.find(
      (forecast: any) => forecast.date === eventDate
    );

    if (!dailyForecast) {
      throw new AppError(404, "Weather forecast not found for the given date, Try again with a different date not more than 7 days from today");
    }

    return {
      date: dailyForecast.date,
      maxTemperature: dailyForecast.temp_max,
      minTemperature: dailyForecast.temp_min,
      precipitation: dailyForecast.precipitation,
      windSpeed: data.current.windspeed,
      weatherCode: dailyForecast.weathercode,
    };
  }
}