import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";
import { motion } from "framer-motion";

export default function HeroSection({ user }) {
  const handleLogin = () => {
    User.login();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3')] bg-cover bg-center opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-sm font-medium text-green-700 dark:text-green-300">
                🌱 Empowering Agriculture
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Smart Farming
                <span className="block text-green-600 dark:text-green-400">
                  Made Simple
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Join thousands of farmers using AI-powered tools for disease detection, 
                weather forecasting, and community support to maximize their harvest.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link to={createPageUrl("Profile")}>
                    <Button size="lg" className="gradient-green text-white hover:opacity-90 group">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="lg" 
                    className="gradient-green text-white hover:opacity-90 group"
                    onClick={handleLogin}
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
                
                <Link to={createPageUrl("Education")}>
                  <Button variant="outline" size="lg" className="group">
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">10k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Disease Detection</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern farming with technology"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
            </div>
            
            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -left-4 top-16 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Disease detected</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -right-4 bottom-16 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <div className="text-2xl">🌤️</div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Today's Weather</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Perfect for planting</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}