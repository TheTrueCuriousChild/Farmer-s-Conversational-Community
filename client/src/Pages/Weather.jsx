import React, { useState, useEffect, useCallback } from "react";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/integrations/Core";
import { User } from "@/entities/User";
import { format, addDays } from "date-fns";
import { motion } from "framer-motion";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState([]);

  const loadUserAndWeather = useCallback(async () => {
    try {
      // Load user data
      const userData = await User.me();
      setUser(userData);
      
      // Get weather data for user's location
      if (userData?.location) {
        const weatherResponse = await InvokeLLM({
          prompt: `Get current weather information and 7-day forecast for ${userData.location}, India. Include temperature, humidity, wind speed, precipitation, and weather conditions. Also provide farming advice based on current weather.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              current: {
                type: "object",
                properties: {
                  temperature: { type: "number" },
                  humidity: { type: "number" },
                  wind_speed: { type: "number" },
                  precipitation: { type: "number" },
                  condition: { type: "string" },
                  feels_like: { type: "number" }
                }
              },
              forecast: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    date: { type: "string" },
                    high_temp: { type: "number" },
                    low_temp: { type: "number" },
                    condition: { type: "string" },
                    precipitation: { type: "number" }
                  }
                }
              },
              farming_advice: { type: "string" }
            }
          }
        });
        
        setWeather(weatherResponse);
        setForecast(weatherResponse.forecast || []);
      }
    } catch (error) {
      console.error("Error loading weather data:", error);
      // Set dummy data if API fails
      setWeather({
        current: {
          temperature: 25,
          humidity: 65,
          wind_speed: 10,
          precipitation: 0,
          condition: "Partly Cloudy",
          feels_like: 28
        },
        farming_advice: "Good weather for most farming activities. Consider watering crops in the evening."
      });
      setForecast(generateDummyForecast());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserAndWeather();
  }, [loadUserAndWeather]);

  const generateDummyForecast = () => {
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"];
    return Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(new Date(), i), "yyyy-MM-dd"),
      high_temp: Math.round(Math.random() * 10 + 25),
      low_temp: Math.round(Math.random() * 8 + 18),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.round(Math.random() * 20)
    }));
  };

  const getWeatherIcon = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun')) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (lowerCondition.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (lowerCondition.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const getConditionColor = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun')) return "bg-yellow-100 text-yellow-800";
    if (lowerCondition.includes('rain')) return "bg-blue-100 text-blue-800";
    if (lowerCondition.includes('cloud')) return "bg-gray-100 text-gray-800";
    return "bg-green-100 text-green-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Weather Forecast
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time weather updates for {user?.location || "your area"}
            </p>
          </div>

          {/* Current Weather */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-600" />
                Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {getWeatherIcon(weather?.current?.condition || "sunny")}
                  <div className="mt-3">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {weather?.current?.temperature || 25}°C
                    </div>
                    <Badge className={getConditionColor(weather?.current?.condition || "sunny")}>
                      {weather?.current?.condition || "Sunny"}
                    </Badge>
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Humidity</span>
                    </div>
                    <span className="font-semibold">{weather?.current?.humidity || 65}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Wind Speed</span>
                    </div>
                    <span className="font-semibold">{weather?.current?.wind_speed || 10} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Precipitation</span>
                    </div>
                    <span className="font-semibold">{weather?.current?.precipitation || 0}%</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Farming Advice</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {weather?.farming_advice || "Good weather conditions for most farming activities. Consider watering crops in the evening to reduce water evaporation."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                7-Day Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[80px]">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(day.date), 'MMM d')}
                        </div>
                      </div>
                      {getWeatherIcon(day.condition)}
                      <div>
                        <Badge className={getConditionColor(day.condition)} variant="secondary">
                          {day.condition}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {day.high_temp}° / {day.low_temp}°
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {day.precipitation}% rain
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}