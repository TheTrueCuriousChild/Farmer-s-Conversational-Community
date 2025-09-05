import React, { useState } from "react";
import { BookOpen, Play, Download, Search, Filter, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const courses = [
  {
    id: 1,
    title: "Modern Rice Cultivation Techniques",
    category: "crop_management",
    duration: "3 hours",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&w=400",
    description: "Learn latest techniques for high-yield rice production including water management and pest control.",
    instructor: "Dr. Raj Kumar",
    lessons: 12,
    price: "Free"
  },
  {
    id: 2,
    title: "Organic Farming Fundamentals",
    category: "organic_farming",
    duration: "5 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 2100,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&w=400",
    description: "Complete guide to organic farming methods, certification process, and market opportunities.",
    instructor: "Prof. Meera Sharma",
    lessons: 18,
    price: "₹999"
  },
  {
    id: 3,
    title: "Smart Irrigation Systems",
    category: "technology",
    duration: "2.5 hours",
    level: "Advanced",
    rating: 4.7,
    students: 890,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&w=400",
    description: "Master drip irrigation, sprinkler systems, and IoT-based water management solutions.",
    instructor: "Eng. Suresh Patel",
    lessons: 10,
    price: "₹1499"
  },
  {
    id: 4,
    title: "Crop Disease Management",
    category: "disease_management",
    duration: "4 hours",
    level: "Intermediate",
    rating: 4.6,
    students: 1580,
    image: "https://images.unsplash.com/photo-1592414113935-ccaa5ad8cc65?ixlib=rb-4.0.3&w=400",
    description: "Identify, prevent, and treat common crop diseases using integrated pest management.",
    instructor: "Dr. Priya Singh",
    lessons: 15,
    price: "₹799"
  },
  {
    id: 5,
    title: "Soil Health & Nutrition",
    category: "soil_management",
    duration: "3.5 hours",
    level: "Beginner",
    rating: 4.8,
    students: 1750,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&w=400",
    description: "Understanding soil composition, testing methods, and natural fertilization techniques.",
    instructor: "Dr. Ashok Kumar",
    lessons: 14,
    price: "Free"
  },
  {
    id: 6,
    title: "Market Analysis & Pricing",
    category: "business",
    duration: "2 hours",
    level: "Advanced",
    rating: 4.5,
    students: 650,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&w=400",
    description: "Learn market trends analysis, pricing strategies, and direct marketing techniques.",
    instructor: "MBA Rahul Gupta",
    lessons: 8,
    price: "₹1299"
  }
];

const resources = [
  {
    title: "Monsoon Farming Guide 2024",
    type: "PDF Guide",
    downloads: 5200,
    size: "2.5 MB"
  },
  {
    title: "Crop Calendar for Different Regions",
    type: "Excel Sheet",
    downloads: 3800,
    size: "1.2 MB"
  },
  {
    title: "Government Scheme Application Forms",
    type: "PDF Pack",
    downloads: 7100,
    size: "4.8 MB"
  }
];

export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getCategoryColor = (category) => {
    const colors = {
      crop_management: "bg-green-100 text-green-800",
      organic_farming: "bg-blue-100 text-blue-800",
      technology: "bg-purple-100 text-purple-800",
      disease_management: "bg-red-100 text-red-800",
      soil_management: "bg-yellow-100 text-yellow-800",
      business: "bg-indigo-100 text-indigo-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getLevelColor = (level) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Education Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Master modern farming techniques with expert-led courses, guides, and resources 
              designed to boost your agricultural productivity and profits.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-green-100">Courses Available</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-blue-100">Active Learners</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-purple-100">Average Rating</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <Download className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">100+</div>
                <div className="text-orange-100">Free Resources</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
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
                    <SelectItem value="crop_management">Crop Management</SelectItem>
                    <SelectItem value="organic_farming">Organic Farming</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="disease_management">Disease Management</SelectItem>
                    <SelectItem value="soil_management">Soil Management</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(course.category)}>
                        {course.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {course.rating}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {course.price}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {course.students} students
                        </div>
                      </div>
                      <Button className="gradient-green text-white hover:opacity-90">
                        {course.price === "Free" ? "Enroll Now" : "Buy Course"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Free Resources Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Free Resources & Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {resource.title}
                      </h4>
                      <Badge variant="secondary">{resource.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {resource.downloads} downloads • {resource.size}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Free
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}