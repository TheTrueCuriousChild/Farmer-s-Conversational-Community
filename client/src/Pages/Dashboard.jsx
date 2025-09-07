
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  TrendingUp,
  Leaf,
  AlertTriangle,
  Calendar,
  ShoppingCart
} from "lucide-react";

export default function Dashboard() {
  const weatherData = {
    temperature: "28°C",
    humidity: "65%",
    rainfall: "2.5mm",
    condition: "Partly Cloudy"
  };

  const farmStats = [
    { title: "Total Crops", value: "12", icon: Leaf, color: "text-green-600" },
    { title: "Healthy Plants", value: "95%", icon: TrendingUp, color: "text-blue-600" },
    { title: "Alerts", value: "3", icon: AlertTriangle, color: "text-orange-600" },
    { title: "Market Orders", value: "7", icon: ShoppingCart, color: "text-purple-600" }
  ];

  const recentActivities = [
    { action: "Watered tomato field", time: "2 hours ago" },
    { action: "Applied fertilizer to wheat crop", time: "1 day ago" },
    { action: "Harvested potatoes - 500kg", time: "2 days ago" },
    { action: "Disease detected in corn field", time: "3 days ago" }
  ];

  const upcomingTasks = [
    { task: "Apply pesticide to rice field", due: "Today" },
    { task: "Harvest ready vegetables", due: "Tomorrow" },
    { task: "Soil testing scheduled", due: "3 days" },
    { task: "Equipment maintenance", due: "1 week" }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Farm Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your farm's performance and activities</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Last updated</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Just now</div>
        </div>
      </div>

      {/* Weather Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-6 h-6" />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Thermometer className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{weatherData.temperature}</div>
              <div className="text-sm opacity-80">Temperature</div>
            </div>
            <div className="text-center">
              <Droplets className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{weatherData.humidity}</div>
              <div className="text-sm opacity-80">Humidity</div>
            </div>
            <div className="text-center">
              <Droplets className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{weatherData.rainfall}</div>
              <div className="text-sm opacity-80">Rainfall</div>
            </div>
            <div className="text-center">
              <Sun className="w-8 h-8 mx-auto mb-2" />
              <div className="text-xl font-bold">{weatherData.condition}</div>
              <div className="text-sm opacity-80">Condition</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {farmStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Calendar className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-200">{activity.action}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Calendar className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-200">{task.task}</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">{task.due}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
