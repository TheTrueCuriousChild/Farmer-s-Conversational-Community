import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer,
  Droplets,
  Eye,
  MapPin
} from "lucide-react";

export default function Weather() {
  const [location, setLocation] = useState("Delhi, India");
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6,
    feelsLike: 31
  });

  const forecast = [
    { day: "Today", high: 32, low: 24, condition: "Sunny", icon: Sun },
    { day: "Tomorrow", high: 29, low: 22, condition: "Cloudy", icon: Cloud },
    { day: "Wednesday", high: 26, low: 20, condition: "Rainy", icon: CloudRain },
    { day: "Thursday", high: 28, low: 21, condition: "Partly Cloudy", icon: Cloud },
    { day: "Friday", high: 31, low: 23, condition: "Sunny", icon: Sun },
    { day: "Saturday", high: 30, low: 22, condition: "Partly Cloudy", icon: Cloud },
    { day: "Sunday", high: 27, low: 19, condition: "Rainy", icon: CloudRain }
  ];

  const farmingAdvice = [
    {
      title: "Irrigation Recommendation",
      advice: "Light irrigation recommended today due to low humidity levels.",
      priority: "medium"
    },
    {
      title: "Pest Alert",
      advice: "Weather conditions favorable for pest activity. Monitor crops closely.",
      priority: "high"
    },
    {
      title: "Harvest Window",
      advice: "Good weather conditions for harvesting over the next 3 days.",
      priority: "low"
    },
    {
      title: "Fertilizer Application",
      advice: "Avoid fertilizer application - rain expected in 2 days.",
      priority: "medium"
    }
  ];

  const getConditionIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return Sun;
      case 'rainy':
        return CloudRain;
      case 'cloudy':
      case 'partly cloudy':
        return Cloud;
      default:
        return Sun;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Forecast</h1>
        <p className="text-gray-600">Stay updated with weather conditions for better farm planning</p>
      </div>

      {/* Location Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">{location}</h2>
              <div className="flex items-center mb-4">
                <div className="text-6xl font-bold mr-4">{currentWeather.temperature}°C</div>
                <div>
                  <Cloud className="w-12 h-12 mb-2" />
                  <p className="text-lg">{currentWeather.condition}</p>
                  <p className="text-blue-200">Feels like {currentWeather.feelsLike}°C</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Droplets className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                <div className="text-sm text-blue-200">Humidity</div>
              </div>
              <div className="text-center">
                <Wind className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.windSpeed} km/h</div>
                <div className="text-sm text-blue-200">Wind Speed</div>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.visibility} km</div>
                <div className="text-sm text-blue-200">Visibility</div>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.uvIndex}</div>
                <div className="text-sm text-blue-200">UV Index</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {forecast.map((day, index) => {
              const IconComponent = day.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg border">
                  <div className="font-semibold mb-2">{day.day}</div>
                  <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-600 mb-2">{day.condition}</div>
                  <div className="font-bold">{day.high}°</div>
                  <div className="text-gray-500 text-sm">{day.low}°</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Farming Advice */}
      <Card>
        <CardHeader>
          <CardTitle>Farming Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {farmingAdvice.map((item, index) => (
              <div key={index} className={`p-4 border-l-4 rounded-lg ${getPriorityColor(item.priority)}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.advice}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Weather Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Cloud className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-800">Heavy Rain Alert</h3>
            </div>
            <p className="text-orange-700">
              Heavy rainfall expected on Wednesday (15-20mm). 
              Secure outdoor equipment and avoid field operations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}