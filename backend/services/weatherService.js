const axios = require("axios")

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY
    this.baseUrl = "https://api.openweathermap.org/data/2.5"
  }

  async getCurrentWeather(coordinates) {
    try {
      const { lat, lon } = coordinates
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: "metric",
        },
      })

      const data = response.data
      return {
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        wind_speed: data.wind.speed,
        wind_direction: data.wind.deg,
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        },
        location: {
          city: data.name,
          country: data.sys.country,
          coordinates: { lat, lon },
        },
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
        timestamp: new Date(),
      }
    } catch (error) {
      console.error("Weather API Error:", error)
      throw new Error("Failed to fetch current weather data")
    }
  }

  async getWeatherForecast(coordinates, days = 5) {
    try {
      const { lat, lon } = coordinates
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: "metric",
          cnt: days * 8, // 8 forecasts per day (every 3 hours)
        },
      })

      const data = response.data

      // Group forecasts by day
      const dailyForecasts = {}
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString()
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temperatures: [],
            humidity: [],
            weather_conditions: [],
            wind_speed: [],
            precipitation: 0,
          }
        }

        dailyForecasts[date].temperatures.push(item.main.temp)
        dailyForecasts[date].humidity.push(item.main.humidity)
        dailyForecasts[date].weather_conditions.push(item.weather[0])
        dailyForecasts[date].wind_speed.push(item.wind.speed)
        if (item.rain) {
          dailyForecasts[date].precipitation += item.rain["3h"] || 0
        }
      })

      // Process daily summaries
      const processedForecast = Object.values(dailyForecasts).map((day) => ({
        date: day.date,
        temperature: {
          min: Math.min(...day.temperatures),
          max: Math.max(...day.temperatures),
          avg: day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length,
        },
        humidity: {
          avg: day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length,
        },
        wind_speed: {
          avg: day.wind_speed.reduce((a, b) => a + b, 0) / day.wind_speed.length,
        },
        precipitation: day.precipitation,
        weather: day.weather_conditions[0], // Most common condition
      }))

      return {
        location: data.city,
        forecast: processedForecast.slice(0, days),
        timestamp: new Date(),
      }
    } catch (error) {
      console.error("Weather Forecast API Error:", error)
      throw new Error("Failed to fetch weather forecast data")
    }
  }

  async getCropAdvice(currentWeather, forecast, crop) {
    try {
      const advice = {
        general: [],
        irrigation: [],
        fertilizer: [],
        pest_management: [],
        harvesting: [],
      }

      // Temperature-based advice
      if (currentWeather.temperature > 35) {
        advice.general.push(
          "High temperature detected. Provide shade for sensitive crops and increase watering frequency.",
        )
        advice.irrigation.push("Water crops early morning or late evening to reduce evaporation.")
      }
      if (currentWeather.temperature < 10) {
        advice.general.push("Low temperature alert. Cover sensitive crops and avoid watering in the evening.")
      }

      // Humidity-based advice
      if (currentWeather.humidity > 80) {
        advice.pest_management.push(
          "High humidity may increase fungal disease risk. Ensure good air circulation and consider fungicide application.",
        )
      }
      if (currentWeather.humidity < 30) {
        advice.irrigation.push(
          "Low humidity detected. Increase irrigation frequency and consider mulching to retain moisture.",
        )
      }

      // Rain forecast advice
      const upcomingRain = forecast.forecast.filter((day) => day.precipitation > 0)
      if (upcomingRain.length > 0) {
        const totalRain = upcomingRain.reduce((sum, day) => sum + day.precipitation, 0)

        if (totalRain > 50) {
          advice.irrigation.push(
            "Heavy rainfall expected. Reduce irrigation and ensure proper drainage to prevent waterlogging.",
          )
          advice.pest_management.push(
            "Wet conditions may increase disease pressure. Monitor crops closely and apply preventive fungicides if needed.",
          )
          advice.general.push("Prepare drainage systems and harvest mature crops before heavy rains if possible.")
        } else if (totalRain > 10) {
          advice.irrigation.push("Moderate rainfall expected. Adjust irrigation schedule accordingly.")
          advice.general.push("Good conditions for most crops. Monitor soil moisture levels.")
        } else {
          advice.irrigation.push("Light rainfall expected. May need supplemental irrigation depending on crop needs.")
        }
      } else {
        advice.irrigation.push("No rainfall expected in coming days. Ensure adequate irrigation scheduling.")
      }

      // Wind speed advice
      if (currentWeather.wind_speed > 15) {
        advice.general.push("High wind speeds detected. Provide support to tall crops and check for wind damage.")
        advice.irrigation.push("Strong winds increase evaporation. Consider increasing irrigation frequency.")
      }

      // Crop-specific advice
      if (crop) {
        const cropAdvice = this.getCropSpecificAdvice(crop, currentWeather, forecast)
        Object.keys(cropAdvice).forEach((category) => {
          if (advice[category]) {
            advice[category].push(...cropAdvice[category])
          }
        })
      }

      // Seasonal advice based on temperature trends
      const tempTrend = this.analyzeTempTrend(forecast)
      if (tempTrend === "increasing") {
        advice.general.push("Temperature trend is increasing. Prepare for heat stress management.")
      } else if (tempTrend === "decreasing") {
        advice.general.push("Temperature trend is decreasing. Monitor for cold stress in sensitive crops.")
      }

      return {
        current_conditions: {
          temperature: currentWeather.temperature,
          humidity: currentWeather.humidity,
          wind_speed: currentWeather.wind_speed,
          weather: currentWeather.weather.description,
        },
        advice,
        timestamp: new Date(),
        location: currentWeather.location,
      }
    } catch (error) {
      console.error("Crop Advice Generation Error:", error)
      throw new Error("Failed to generate crop advice")
    }
  }

  getCropSpecificAdvice(crop, currentWeather, forecast) {
    const cropLower = crop.toLowerCase()
    const advice = {
      general: [],
      irrigation: [],
      fertilizer: [],
      pest_management: [],
      harvesting: [],
    }

    // Rice-specific advice
    if (cropLower.includes("rice") || cropLower.includes("paddy")) {
      if (currentWeather.temperature > 32) {
        advice.irrigation.push("Maintain 2-5cm water level in rice fields during high temperatures.")
      }
      if (currentWeather.humidity > 85) {
        advice.pest_management.push(
          "High humidity increases blast and sheath blight risk in rice. Apply preventive fungicides.",
        )
      }
    }

    // Wheat-specific advice
    else if (cropLower.includes("wheat")) {
      if (currentWeather.temperature < 5) {
        advice.general.push(
          "Cold temperatures may affect wheat germination and growth. Consider frost protection measures.",
        )
      }
      if (currentWeather.temperature > 25) {
        advice.irrigation.push("High temperatures during grain filling stage. Ensure adequate moisture for wheat.")
      }
    }

    // Cotton-specific advice
    else if (cropLower.includes("cotton")) {
      if (currentWeather.temperature > 35) {
        advice.general.push("High temperatures may cause flower drop in cotton. Provide adequate irrigation.")
      }
      if (currentWeather.humidity < 40) {
        advice.pest_management.push("Low humidity may increase thrips and spider mite activity in cotton.")
      }
    }

    // Tomato-specific advice
    else if (cropLower.includes("tomato")) {
      if (currentWeather.humidity > 80) {
        advice.pest_management.push("High humidity increases late blight risk in tomatoes. Ensure good ventilation.")
      }
      if (currentWeather.temperature > 30) {
        advice.general.push(
          "High temperatures may cause blossom end rot in tomatoes. Maintain consistent soil moisture.",
        )
      }
    }

    // Sugarcane-specific advice
    else if (cropLower.includes("sugarcane")) {
      if (currentWeather.temperature > 35) {
        advice.irrigation.push("High temperatures increase water demand in sugarcane. Irrigate every 7-10 days.")
      }
    }

    return advice
  }

  analyzeTempTrend(forecast) {
    if (forecast.forecast.length < 3) return "stable"

    const temps = forecast.forecast.slice(0, 3).map((day) => day.temperature.avg)
    const firstTemp = temps[0]
    const lastTemp = temps[temps.length - 1]

    if (lastTemp - firstTemp > 3) return "increasing"
    if (firstTemp - lastTemp > 3) return "decreasing"
    return "stable"
  }

  async getWeatherAlerts(coordinates) {
    try {
      const currentWeather = await this.getCurrentWeather(coordinates)
      const forecast = await this.getWeatherForecast(coordinates, 3)

      const alerts = []

      // Temperature alerts
      if (currentWeather.temperature > 40) {
        alerts.push({
          type: "heat_wave",
          severity: "high",
          message: "Extreme heat warning. Take immediate measures to protect crops and livestock.",
          recommendations: [
            "Increase irrigation frequency",
            "Provide shade for livestock",
            "Harvest mature crops if possible",
          ],
        })
      }

      if (currentWeather.temperature < 2) {
        alerts.push({
          type: "frost",
          severity: "high",
          message: "Frost warning. Protect sensitive crops from cold damage.",
          recommendations: ["Cover sensitive plants", "Use frost protection methods", "Avoid irrigation in evening"],
        })
      }

      // Wind alerts
      if (currentWeather.wind_speed > 20) {
        alerts.push({
          type: "high_wind",
          severity: "medium",
          message: "High wind speeds detected. Secure loose structures and support tall crops.",
          recommendations: ["Provide support to tall crops", "Secure farm equipment", "Check for wind damage"],
        })
      }

      // Heavy rain alerts
      const heavyRainDays = forecast.forecast.filter((day) => day.precipitation > 25)
      if (heavyRainDays.length > 0) {
        alerts.push({
          type: "heavy_rain",
          severity: "medium",
          message: "Heavy rainfall expected. Prepare drainage and harvest ready crops.",
          recommendations: ["Ensure proper field drainage", "Harvest mature crops", "Apply preventive fungicides"],
        })
      }

      return {
        alerts,
        current_weather: currentWeather,
        timestamp: new Date(),
      }
    } catch (error) {
      console.error("Weather Alerts Error:", error)
      throw new Error("Failed to generate weather alerts")
    }
  }
}

module.exports = new WeatherService()
