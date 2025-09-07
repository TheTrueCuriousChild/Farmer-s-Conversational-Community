
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Leaf, TrendingUp } from "lucide-react";

export default function FarmPlanning() {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [season, setSeason] = useState("");

  const crops = [
    { name: "Rice", season: "Kharif", duration: "120-150 days", yield: "4-6 tons/hectare" },
    { name: "Wheat", season: "Rabi", duration: "110-130 days", yield: "3-5 tons/hectare" },
    { name: "Maize", season: "Kharif/Rabi", duration: "80-110 days", yield: "5-8 tons/hectare" },
    { name: "Sugarcane", season: "Year-round", duration: "12-18 months", yield: "60-80 tons/hectare" },
    { name: "Cotton", season: "Kharif", duration: "150-180 days", yield: "1-2 tons/hectare" },
    { name: "Tomato", season: "Year-round", duration: "90-120 days", yield: "20-40 tons/hectare" }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Soil Analysis",
      description: "Test soil pH, nutrients, and organic matter content",
      status: "completed"
    },
    {
      step: 2,
      title: "Crop Selection",
      description: "Choose crops based on soil type and climate",
      status: "in-progress"
    },
    {
      step: 3,
      title: "Resource Planning",
      description: "Plan water, fertilizers, and equipment needs",
      status: "pending"
    },
    {
      step: 4,
      title: "Schedule Creation",
      description: "Create planting, care, and harvest schedules",
      status: "pending"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Farm Planning</h1>
        <p className="text-gray-600 dark:text-gray-400">Plan your crops and farming activities for optimal yield</p>
      </div>

      {/* Planning Steps */}
      <Card className="dark:bg-gray-900 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Planning Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planningSteps.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  item.status === 'completed' ? 'bg-green-500' : 
                  item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500 dark:bg-gray-600'
                }`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
                  item.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {item.status.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Crop Selection */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Leaf className="w-5 h-5" />
              Crop Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Select Crop</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop, index) => (
                      <SelectItem key={index} value={crop.name}>{crop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Season</label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                    <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                    <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Generate Plan</Button>
            </div>
          </CardContent>
        </Card>

        {/* Crop Information */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <TrendingUp className="w-5 h-5" />
              Crop Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crops.slice(0, 3).map((crop, index) => (
                <div key={index} className="p-4 border dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{crop.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Season:</span>
                      <span className="ml-2 font-medium dark:text-gray-200">{crop.season}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="ml-2 font-medium dark:text-gray-200">{crop.duration}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Expected Yield:</span>
                      <span className="ml-2 font-medium dark:text-gray-200">{crop.yield}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="dark:bg-gray-900 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <Calendar className="w-5 h-5" />
            Farming Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Planting Season</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">June - August</p>
              <p className="text-green-600 dark:text-green-400 font-medium">Kharif Crops</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Growing Season</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">September - November</p>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Care & Maintenance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Harvest Season</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">December - February</p>
              <p className="text-orange-600 dark:text-orange-400 font-medium">Harvest & Storage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
