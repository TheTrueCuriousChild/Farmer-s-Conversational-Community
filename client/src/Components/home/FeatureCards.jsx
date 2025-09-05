import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Camera, CloudRain, BookOpen, MessageSquare, 
  ShoppingCart, Bell, TrendingUp, Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Disease Detection",
    description: "Upload crop photos and get instant disease diagnosis with treatment recommendations",
    icon: Camera,
    link: "DiseaseChecker",
    color: "bg-blue-500",
    badge: "New"
  },
  {
    title: "Smart Weather Forecast",
    description: "Get accurate weather predictions tailored for your farming location and crops",
    icon: CloudRain,
    link: "Weather",
    color: "bg-cyan-500"
  },
  {
    title: "Learning Hub",
    description: "Access modern farming techniques, courses and expert guidance",
    icon: BookOpen,
    link: "Education",
    color: "bg-purple-500"
  },
  {
    title: "Farmer Community",
    description: "Connect with fellow farmers, share experiences and get support",
    icon: MessageSquare,
    link: "Community",
    color: "bg-green-500"
  },
  {
    title: "Produce Marketplace",
    description: "Sell your produce directly to retailers and get fair market prices",
    icon: ShoppingCart,
    link: "Marketplace",
    color: "bg-orange-500",
    badge: "Popular"
  },
  {
    title: "Government Schemes",
    description: "Stay updated with latest government schemes and subsidies for farmers",
    icon: Bell,
    link: "GovernmentSchemes",
    color: "bg-red-500"
  },
  {
    title: "Crop Analytics",
    description: "Track your crop performance with detailed analytics and insights",
    icon: TrendingUp,
    link: "Profile",
    color: "bg-indigo-500"
  },
  {
    title: "24/7 Support",
    description: "Get instant help and support for all your farming queries",
    icon: Shield,
    link: "Support",
    color: "bg-emerald-500"
  }
];

export default function FeatureCards() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for
            <span className="text-green-600 dark:text-green-400"> Smart Farming</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need 
            to modernize your farming practices and increase productivity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={createPageUrl(feature.link)}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      {feature.badge && (
                        <Badge className="absolute -top-2 -right-2 text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}