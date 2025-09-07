
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
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function Education() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      title: "Modern Irrigation Techniques",
      instructor: "Dr. Rajesh Kumar",
      duration: "4 weeks",
      students: 1247,
      rating: 4.8,
      level: "beginner", // Changed to lowercase as per getLevelColor
      description: "Learn water-efficient irrigation methods including drip and sprinkler systems.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"
    },
    {
      title: "Organic Farming Essentials",
      instructor: "Priya Sharma",
      duration: "6 weeks",
      students: 2156,
      rating: 4.9,
      level: "beginner",
      description: "Complete guide to organic farming practices and certification processes.",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop"
    },
    {
      title: "Crop Disease Management",
      instructor: "Dr. Amit Singh",
      duration: "3 weeks",
      students: 987,
      rating: 4.7,
      level: "advanced", // Changed to lowercase
      description: "Identify, prevent, and treat common crop diseases using integrated approaches.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop"
    },
    {
      title: "Soil Health & Nutrition",
      instructor: "Dr. Meera Patel",
      duration: "5 weeks",
      students: 1634,
      rating: 4.8,
      level: "intermediate", // Changed to lowercase
      description: "Understanding soil composition, testing, and nutrient management.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"
    },
    {
      title: "Smart Farming Technology",
      instructor: "Vikash Gupta",
      duration: "4 weeks",
      students: 892,
      rating: 4.6,
      level: "advanced", // Changed to lowercase
      description: "IoT sensors, drones, and precision agriculture technologies.",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=200&fit=crop"
    },
    {
      title: "Sustainable Agriculture",
      instructor: "Dr. Sunita Roy",
      duration: "8 weeks",
      students: 2341,
      rating: 4.9,
      level: "intermediate", // Changed to lowercase
      description: "Environmental-friendly farming practices for long-term sustainability.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop"
    }
  ];

  // The categories and achievements arrays are removed as they are replaced with direct t() calls in JSX.

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('farmEducationTitle')}</h1>
        <p className="text-gray-600">{t('learnModernFarming')}</p>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">{t('courseCompletion')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-600">{t('certificatesEarned')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-600">{t('studyHours')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="text-sm text-gray-600">{t('communityRank')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('searchCourses')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[t('allCourses'), t('cropManagement'), t('technology'), t('sustainability'), t('soilScience'), t('irrigation'), t('diseaseControl')].map((category, index) => (
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
                  {course.level === 'beginner' ? t('beginner') :
                   course.level === 'intermediate' ? t('intermediate') : t('advanced')}
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
                  {course.students} {t('students')}
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
                {t('startLearning')}
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
              <h2 className="text-2xl font-bold mb-2">{t('joinExpertWebinar')}</h2>
              <p className="text-green-100 mb-4">
                "{t('futureOfAgriculture')}"
              </p>
              <p className="text-sm text-green-200">
                {t('liveSessionExperts')}
              </p>
            </div>
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              {t('registerNow')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
