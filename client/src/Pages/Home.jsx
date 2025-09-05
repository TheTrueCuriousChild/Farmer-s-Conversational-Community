import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowRight, Users, Leaf, CloudRain, BookOpen, 
  MessageSquare, ShoppingCart, Camera, TrendingUp,
  Shield, Award, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { motion } from "framer-motion";

import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import StatsSection from "../components/home/StatsSection";
import NewsletterSection from "../components/home/NewsletterSection";
import ChatBot from "../components/shared/ChatBot";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection user={user} />

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Stats Section */}
      <StatsSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Chatbot */}
      <ChatBot user={user} />
    </div>
  );
}