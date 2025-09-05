
import React, { useState, useEffect, useCallback } from "react";
import { FileText, Calendar, Users, MapPin, Phone, ExternalLink, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GovernmentScheme } from "@/entities/GovernmentScheme";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTargetGroup, setSelectedTargetGroup] = useState("all");

  const setDummySchemes = useCallback(() => {
    const dummyData = [
      {
        id: 1,
        scheme_name: "PM-KISAN Scheme",
        description: "Direct income support to farmers providing ₹6000 per year in three equal installments.",
        eligibility: "All landholding farmer families eligible regardless of size of land holding",
        benefits: "₹6000 per year in three installments of ₹2000 each",
        application_process: "Apply online through PM-KISAN portal or visit nearest Common Service Center",
        last_date: "2024-03-31",
        category: "subsidy",
        target_group: "all_farmers",
        state: "All India",
        contact_info: "Helpline: 155261 | pmkisan-ict@gov.in"
      },
      {
        id: 2,
        scheme_name: "Pradhan Mantri Fasal Bima Yojana",
        description: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage",
        eligibility: "All farmers growing notified crops in notified areas",
        benefits: "Up to ₹2 lakh sum insured per farmer per season",
        application_process: "Apply through banks, insurance companies, or online portal",
        last_date: "2024-04-15",
        category: "insurance",
        target_group: "all_farmers",
        state: "All India", 
        contact_info: "Toll-free: 18001801551"
      },
      {
        id: 3,
        scheme_name: "Kisan Credit Card Scheme",
        description: "Provides adequate and timely credit support for agriculture and allied activities",
        eligibility: "All farmers including tenant farmers, oral lessees, sharecroppers",
        benefits: "Credit limit up to ₹3 lakh at 4% interest rate",
        application_process: "Apply at nearest bank branch with required documents",
        last_date: "2024-12-31",
        category: "loan",
        target_group: "all_farmers",
        state: "All India",
        contact_info: "Contact your nearest bank branch"
      },
      {
        id: 4,
        scheme_name: "Mahila Kisan Sashaktikaran Pariyojana",
        description: "Sub-component of DAY-NRLM to enhance opportunities for women in agriculture",
        eligibility: "Rural women engaged in agriculture and allied activities",
        benefits: "Training, capacity building, and financial support for women farmers",
        application_process: "Contact State Rural Livelihood Mission offices",
        last_date: "2024-06-30",
        category: "training",
        target_group: "women_farmers",
        state: "All India",
        contact_info: "Contact SRLM offices in respective states"
      },
      {
        id: 5,
        scheme_name: "Soil Health Card Scheme",
        description: "Provides soil health cards to farmers with recommendations on nutrient management",
        eligibility: "All farmers owning land",
        benefits: "Free soil testing and customized fertilizer recommendations",
        application_process: "Apply through Agriculture Extension Officer or online portal",
        last_date: "2024-05-31",
        category: "subsidy",
        target_group: "all_farmers",
        state: "All India",
        contact_info: "Contact District Agriculture Officer"
      },
      {
        id: 6,
        scheme_name: "Sub-Mission on Agricultural Mechanization",
        description: "Promotes mechanization in agriculture through financial assistance",
        eligibility: "Individual farmers, FPOs, cooperatives, custom hiring centers",
        benefits: "40-50% subsidy on agricultural machinery and equipment",
        application_process: "Apply through State Agriculture Department portal",
        last_date: "2024-07-31",
        category: "equipment",
        target_group: "small_farmers",
        state: "All India",
        contact_info: "Contact State Agriculture Department"
      }
    ];
    setSchemes(dummyData);
  }, []);

  const loadSchemes = useCallback(async () => {
    try {
      const schemeData = await GovernmentScheme.list('-created_date', 50);
      setSchemes(schemeData);
    } catch (error) {
      console.error("Error loading schemes:", error);
      // Set dummy data if entity is empty
      setDummySchemes();
    }
    setLoading(false);
  }, [setDummySchemes]); // setDummySchemes is a dependency because it's used inside loadSchemes

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
    const matchesTargetGroup = selectedTargetGroup === "all" || scheme.target_group === selectedTargetGroup;
    
    return matchesSearch && matchesCategory && matchesTargetGroup;
  });

  const getCategoryColor = (category) => {
    const colors = {
      subsidy: "bg-green-100 text-green-800",
      loan: "bg-blue-100 text-blue-800",
      insurance: "bg-purple-100 text-purple-800",
      training: "bg-orange-100 text-orange-800",
      equipment: "bg-indigo-100 text-indigo-800",
      irrigation: "bg-cyan-100 text-cyan-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getTargetGroupColor = (targetGroup) => {
    const colors = {
      small_farmers: "bg-yellow-100 text-yellow-800",
      marginal_farmers: "bg-red-100 text-red-800", 
      all_farmers: "bg-green-100 text-green-800",
      women_farmers: "bg-pink-100 text-pink-800",
      young_farmers: "bg-blue-100 text-blue-800"
    };
    return colors[targetGroup] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Government Schemes & Notices
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with latest government schemes, subsidies, and support programs for farmers
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{schemes.length}</div>
                <div className="text-green-100">Active Schemes</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">5M+</div>
                <div className="text-blue-100">Beneficiaries</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">All</div>
                <div className="text-purple-100">States Covered</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-orange-100">New This Year</div>
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
                    placeholder="Search schemes..."
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
                    <SelectItem value="subsidy">Subsidy</SelectItem>
                    <SelectItem value="loan">Loan</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="irrigation">Irrigation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTargetGroup} onValueChange={setSelectedTargetGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Target Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    <SelectItem value="small_farmers">Small Farmers</SelectItem>
                    <SelectItem value="marginal_farmers">Marginal Farmers</SelectItem>
                    <SelectItem value="all_farmers">All Farmers</SelectItem>
                    <SelectItem value="women_farmers">Women Farmers</SelectItem>
                    <SelectItem value="young_farmers">Young Farmers</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schemes List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading schemes...</p>
              </div>
            ) : (
              filteredSchemes.map((scheme, index) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {scheme.scheme_name}
                            </h3>
                            <Badge className={getCategoryColor(scheme.category)}>
                              {scheme.category}
                            </Badge>
                            <Badge className={getTargetGroupColor(scheme.target_group)}>
                              {scheme.target_group?.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {scheme.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              Eligibility
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {scheme.eligibility}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              Benefits
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {scheme.benefits}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              How to Apply
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {scheme.application_process}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-red-600">
                              <Calendar className="w-4 h-4" />
                              Last Date: {scheme.last_date ? format(new Date(scheme.last_date), 'MMM d, yyyy') : 'Ongoing'}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <MapPin className="w-4 h-4" />
                              {scheme.state}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Phone className="w-4 h-4" />
                            {scheme.contact_info}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button className="gradient-green text-white hover:opacity-90">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}

            {!loading && filteredSchemes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No schemes found matching your criteria
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
