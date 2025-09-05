import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Calendar, Sprout, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InvokeLLM } from "@/integrations/Core";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FarmPlanning() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    crop_type: "",
    season: "",
    land_size: "",
    soil_type: "",
    previous_crops: "",
    budget: "",
    farming_experience: ""
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        location: userData.location || "",
        land_size: userData.land_size?.toString() || ""
      }));
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateFarmPlan = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await InvokeLLM({
        prompt: `Create a comprehensive farm planning recommendation based on:
        - Location: ${formData.location}
        - Crop Type: ${formData.crop_type}
        - Season: ${formData.season}
        - Land Size: ${formData.land_size} acres
        - Soil Type: ${formData.soil_type}
        - Previous Crops: ${formData.previous_crops}
        - Budget: ₹${formData.budget}
        - Farming Experience: ${formData.farming_experience}
        
        Provide detailed recommendations including:
        1. Best crop varieties for the conditions
        2. Planting schedule and timeline
        3. Expected yield and profit projections
        4. Input requirements (seeds, fertilizers, pesticides)
        5. Irrigation requirements
        6. Risk factors and mitigation strategies
        7. Market analysis and pricing trends
        8. Cost breakdown and ROI analysis`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            recommended_varieties: { type: "array", items: { type: "string" } },
            planting_schedule: {
              type: "object",
              properties: {
                seed_preparation: { type: "string" },
                sowing_date: { type: "string" },
                harvest_date: { type: "string" }
              }
            },
            yield_projection: {
              type: "object", 
              properties: {
                expected_yield_per_acre: { type: "number" },
                total_expected_yield: { type: "number" },
                market_price_range: { type: "string" },
                gross_income: { type: "number" }
              }
            },
            input_requirements: {
              type: "object",
              properties: {
                seeds: { type: "string" },
                fertilizers: { type: "string" },
                pesticides: { type: "string" },
                irrigation: { type: "string" }
              }
            },
            cost_analysis: {
              type: "object",
              properties: {
                total_investment: { type: "number" },
                operational_cost: { type: "number" },
                expected_profit: { type: "number" },
                roi_percentage: { type: "number" }
              }
            },
            risk_factors: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            weather_considerations: { type: "string" }
          }
        }
      });

      setRecommendations(response);
    } catch (error) {
      console.error("Error generating farm plan:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Farm Planning
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Get personalized farming recommendations for maximum yield
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  Farm Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={generateFarmPlan} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter your location"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="land_size">Land Size (acres)</Label>
                      <Input
                        id="land_size"
                        type="number"
                        value={formData.land_size}
                        onChange={(e) => handleInputChange('land_size', e.target.value)}
                        placeholder="Enter land size"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crop_type">Crop Type</Label>
                      <Select onValueChange={(value) => handleInputChange('crop_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="maize">Maize</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="sugarcane">Sugarcane</SelectItem>
                          <SelectItem value="tomato">Tomato</SelectItem>
                          <SelectItem value="onion">Onion</SelectItem>
                          <SelectItem value="potato">Potato</SelectItem>
                          <SelectItem value="soybean">Soybean</SelectItem>
                          <SelectItem value="groundnut">Groundnut</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Select onValueChange={(value) => handleInputChange('season', value)}>
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
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="soil_type">Soil Type</Label>
                      <Select onValueChange={(value) => handleInputChange('soil_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="loam">Loam</SelectItem>
                          <SelectItem value="black">Black Cotton</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="alluvial">Alluvial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (₹)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="Enter available budget"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previous_crops">Previous Crops (last 2 years)</Label>
                    <Input
                      id="previous_crops"
                      value={formData.previous_crops}
                      onChange={(e) => handleInputChange('previous_crops', e.target.value)}
                      placeholder="e.g., Rice, Wheat, Cotton"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farming_experience">Farming Experience</Label>
                    <Select onValueChange={(value) => handleInputChange('farming_experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (6-10 years)</SelectItem>
                        <SelectItem value="expert">Expert (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-green text-white hover:opacity-90"
                    disabled={loading || !formData.location || !formData.crop_type}
                  >
                    {loading ? "Generating Plan..." : "Generate Farm Plan"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!recommendations && !loading && (
                  <div className="text-center py-12">
                    <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Fill in your farm details to get personalized recommendations
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Analyzing your farm conditions...
                    </p>
                  </div>
                )}

                {recommendations && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Recommended Varieties */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Recommended Varieties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.recommended_varieties?.map((variety, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                            {variety}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Yield Projection */}
                    {recommendations.yield_projection && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                          Yield & Profit Projection
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Expected Yield</p>
                            <p className="font-bold text-blue-700 dark:text-blue-300">
                              {recommendations.yield_projection.total_expected_yield} quintals
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Gross Income</p>
                            <p className="font-bold text-green-700 dark:text-green-300">
                              ₹{recommendations.yield_projection.gross_income?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cost Analysis */}
                    {recommendations.cost_analysis && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                          Investment Analysis
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Investment:</span>
                            <span className="font-semibold">₹{recommendations.cost_analysis.total_investment?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Profit:</span>
                            <span className="font-semibold text-green-700">₹{recommendations.cost_analysis.expected_profit?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ROI:</span>
                            <span className="font-bold text-green-700">{recommendations.cost_analysis.roi_percentage}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {recommendations.risk_factors && recommendations.risk_factors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">
                          Risk Factors
                        </h4>
                        <div className="space-y-2">
                          {recommendations.risk_factors.map((risk, index) => (
                            <Alert key={index} className="border-red-200">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                {risk}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {recommendations.recommendations && recommendations.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Key Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {recommendations.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-600 dark:text-gray-300">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}