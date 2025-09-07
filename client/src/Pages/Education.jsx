import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Play, 
  Users, 
  Award, 
  Search,
  Clock,
  Star
} from "lucide-react";

export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      title: "Modern Irrigation Techniques",
      instructor: "Dr. Rajesh Kumar",
      duration: "4 weeks",
      students: 1247,
      rating: 4.8,
      level: "Intermediate",
      description: "Learn water-efficient irrigation methods including drip and sprinkler systems.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"
    },
    {
      title: "Organic Farming Essentials",
      instructor: "Priya Sharma",
      duration: "6 weeks",
      students: 2156,
      rating: 4.9,
      level: "Beginner",
      description: "Complete guide to organic farming practices and certification processes.",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop"
    },
    {
      title: "Crop Disease Management",
      instructor: "Dr. Amit Singh",
      duration: "3 weeks",
      students: 987,
      rating: 4.7,
      level: "Advanced",
      description: "Identify, prevent, and treat common crop diseases using integrated approaches.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop"
    },
    {
      title: "Soil Health & Nutrition",
      instructor: "Dr. Meera Patel",
      duration: "5 weeks",
      students: 1634,
      rating: 4.8,
      level: "Intermediate",
      description: "Understanding soil composition, testing, and nutrient management.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"
    },
    {
      title: "Smart Farming Technology",
      instructor: "Vikash Gupta",
      duration: "4 weeks",
      students: 892,
      rating: 4.6,
      level: "Advanced",
      description: "IoT sensors, drones, and precision agriculture technologies.",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=200&fit=crop"
    },
    {
      title: "Sustainable Agriculture",
      instructor: "Dr. Sunita Roy",
      duration: "8 weeks",
      students: 2341,
      rating: 4.9,
      level: "Intermediate",
      description: "Environmental-friendly farming practices for long-term sustainability.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop"
    }
  ];

  const categories = [
    "All Courses",
    "Crop Management",
    "Technology",
    "Sustainability",
    "Soil Science",
    "Irrigation",
    "Disease Control"
  ];

  const achievements = [
    { title: "Course Completion", count: 12, icon: Award },
    { title: "Certificates Earned", count: 8, icon: BookOpen },
    { title: "Study Hours", count: 156, icon: Clock },
    { title: "Community Rank", count: 42, icon: Users }
  ];

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Education</h1>
        <p className="text-gray-600">Learn modern farming techniques and best practices</p>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <achievement.icon className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{achievement.count}</div>
              <div className="text-sm text-gray-600">{achievement.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <p className="text-sm text-gray-600">{course.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students} students
                </div>
                <div className="flex items-center text-yellow-600">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {course.rating}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div>By {course.instructor}</div>
              </div>
              
              <Button className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Content */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Join Our Expert Webinar</h2>
              <p className="text-green-100 mb-4">
                "Future of Agriculture: Technology and Sustainability"
              </p>
              <p className="text-sm text-green-200">
                Live session with industry experts • Tomorrow at 2:00 PM
              </p>
            </div>
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              Register Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}