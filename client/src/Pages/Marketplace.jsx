import React, { useState, useEffect } from "react";
import { ShoppingCart, Clock, TrendingUp, MapPin, Calendar, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketRate } from "@/entities/MarketRate";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Marketplace() {
  const [marketRates, setMarketRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    loadMarketRates();
  }, []);

  const loadMarketRates = async () => {
    try {
      const rates = await MarketRate.list('-date', 100);
      setMarketRates(rates);
    } catch (error) {
      console.error("Error loading market rates:", error);
    }
    setLoading(false);
  };

  const filteredRates = marketRates.filter(rate => {
    const matchesSearch = rate.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.market_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || rate.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || rate.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const uniqueLocations = [...new Set(marketRates.map(rate => rate.location))];
  
  const categoryColors = {
    rice: "bg-yellow-100 text-yellow-800",
    vegetables: "bg-green-100 text-green-800", 
    fruits: "bg-red-100 text-red-800",
    grains: "bg-amber-100 text-amber-800",
    spices: "bg-orange-100 text-orange-800"
  };

  const getPriceChangeIcon = () => {
    return <TrendingUp className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Market Rates & Trading
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Live market prices, timings, and trends for better trading decisions
            </p>
          </div>

          {/* Market Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Markets</p>
                    <p className="text-2xl font-bold">{uniqueLocations.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Commodities</p>
                    <p className="text-2xl font-bold">{[...new Set(marketRates.map(r => r.commodity))].length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Avg Price</p>
                    <p className="text-2xl font-bold">₹{Math.round(marketRates.reduce((sum, r) => sum + r.modal_price, 0) / marketRates.length || 0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Today's Updates</p>
                    <p className="text-2xl font-bold">{marketRates.filter(r => format(new Date(r.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search commodity or market..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Market Rates Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Live Market Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading market data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="space-y-4">
                    {filteredRates.map((rate, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                  {rate.commodity}
                                </h3>
                                <Badge className={categoryColors[rate.category] || "bg-gray-100 text-gray-800"}>
                                  {rate.category}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {rate.market_name}, {rate.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {rate.opening_time} - {rate.closing_time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(rate.date), "MMM d, yyyy")}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl font-bold text-green-600">
                                ₹{rate.modal_price}
                              </span>
                              {getPriceChangeIcon()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Range: ₹{rate.min_price} - ₹{rate.max_price} per kg
                            </div>
                          </div>
                        </div>

                        {rate.variety && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Variety:</span> {rate.variety}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {filteredRates.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No market data found for your search criteria
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}