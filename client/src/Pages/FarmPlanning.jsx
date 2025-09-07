import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Leaf, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function FarmPlanning() {
  const { t } = useLanguage();
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
      title: t('soilAnalysis'),
      description: t('soilAnalysisDesc'),
      status: "completed"
    },
    {
      step: 2,
      title: t('cropSelection'),
      description: t('cropSelectionDesc'),
      status: "in-progress"
    },
    {
      step: 3,
      title: t('resourcePlanning'),
      description: t('resourcePlanningDesc'),
      status: "pending"
    },
    {
      step: 4,
      title: t('scheduleCreation'),
      description: t('scheduleCreationDesc'),
      status: "pending"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('farmPlanningTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('farmPlanningDesc')}</p>
      </div>

      {/* Planning Steps */}
      <Card className="dark:bg-gray-900 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">{t('planningProcess')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planningSteps.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getStatusColor(item.status)}`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                  {item.status === 'completed' ? t('completed') : 
                   item.status === 'in-progress' ? t('inProgress') : t('pending')}
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
              {t('cropSelection')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('selectCrop')}</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('chooseCrop')} />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop, index) => (
                      <SelectItem key={index} value={crop.name}>{crop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('season')}</label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectSeason')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">{t('kharifMonsoon')}</SelectItem>
                    <SelectItem value="rabi">{t('rabiWinter')}</SelectItem>
                    <SelectItem value="zaid">{t('zaidSummer')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">{t('generatePlan')}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Crop Information */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <TrendingUp className="w-5 h-5" />
              {t('cropInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crops.slice(0, 3).map((crop, index) => (
                <div key={index} className="p-4 border dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{crop.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{t('season')}:</span>
                      <span className="ml-2 font-medium dark:text-gray-200">{crop.season}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{t('duration')}:</span>
                      <span className="ml-2 font-medium dark:text-gray-200">{crop.duration}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">{t('expectedYield')}:</span>
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
            {t('farmingCalendar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">{t('plantingSeason')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">June - August</p>
              <p className="text-green-600 dark:text-green-400 font-medium">Kharif Crops</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">{t('growingSeason')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">September - November</p>
              <p className="text-blue-600 dark:text-blue-400 font-medium">{t('careMaintenance')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">{t('harvestSeason')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">December - February</p>
              <p className="text-orange-600 dark:text-orange-400 font-medium">{t('harvestStorage')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
