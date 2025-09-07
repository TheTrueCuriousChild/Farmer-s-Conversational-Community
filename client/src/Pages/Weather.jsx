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
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function Weather() {
  const { t } = useLanguage();

  const [location, setLocation] = useState("Delhi, India");
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 28,
    condition: "condition.partlyCloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6,
    feelsLike: 31
  });

  const forecast = [
    { dayKey: "day.today", high: 32, low: 24, conditionKey: "condition.sunny", icon: Sun },
    { dayKey: "day.tomorrow", high: 29, low: 22, conditionKey: "condition.cloudy", icon: Cloud },
    { dayKey: "day.wednesday", high: 26, low: 20, conditionKey: "condition.rainy", icon: CloudRain },
    { dayKey: "day.thursday", high: 28, low: 21, conditionKey: "condition.partlyCloudy", icon: Cloud },
    { dayKey: "day.friday", high: 31, low: 23, conditionKey: "condition.sunny", icon: Sun },
    { dayKey: "day.saturday", high: 30, low: 22, conditionKey: "condition.partlyCloudy", icon: Cloud },
    { dayKey: "day.sunday", high: 27, low: 19, conditionKey: "condition.rainy", icon: CloudRain }
  ];

  const farmingAdvice = [
    {
      titleKey: "advice.irrigationTitle",
      adviceKey: "advice.irrigationText",
      priority: "medium"
    },
    {
      titleKey: "advice.pestAlertTitle",
      adviceKey: "advice.pestAlertText",
      priority: "high"
    },
    {
      titleKey: "advice.harvestWindowTitle",
      adviceKey: "advice.harvestWindowText",
      priority: "low"
    },
    {
      titleKey: "advice.fertilizerApplicationTitle",
      adviceKey: "advice.fertilizerApplicationText",
      priority: "medium"
    }
  ];

  const getConditionIcon = (conditionKey) => {
    switch (conditionKey) {
      case 'condition.sunny':
        return Sun;
      case 'condition.rainy':
        return CloudRain;
      case 'condition.cloudy':
      case 'condition.partlyCloudy':
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('weatherForecastTitle')}</h1>
        <p className="text-gray-600">{t('stayUpdated')}</p>
      </div>

      {/* Location Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('searchLocation')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>{t('search')}</Button>
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
                  {React.createElement(getConditionIcon(currentWeather.condition), { className: "w-12 h-12 mb-2" })}
                  <p className="text-lg">{t(currentWeather.condition)}</p>
                  <p className="text-blue-200">{t('feelsLike')} {currentWeather.feelsLike}°C</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Droplets className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                <div className="text-sm text-blue-200">{t('humidity')}</div>
              </div>
              <div className="text-center">
                <Wind className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.windSpeed} km/h</div>
                <div className="text-sm text-blue-200">{t('windSpeed')}</div>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.visibility} km</div>
                <div className="text-sm text-blue-200">{t('visibility')}</div>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.uvIndex}</div>
                <div className="text-sm text-blue-200">{t('uvIndex')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sevenDayForecast')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {forecast.map((day, index) => {
              const IconComponent = day.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg border">
                  <div className="font-semibold mb-2">{t(day.dayKey)}</div>
                  <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-600 mb-2">{t(day.conditionKey)}</div>
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
          <CardTitle>{t('farmingRecommendations')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {farmingAdvice.map((item, index) => (
              <div key={index} className={`p-4 border-l-4 rounded-lg ${getPriorityColor(item.priority)}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-700">{t(item.adviceKey)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">{t('weatherAlerts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Cloud className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-800">{t('heavyRainAlertTitle')}</h3>
            </div>
            <p className="text-orange-700">
              {t('heavyRainAlertAdvice')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
