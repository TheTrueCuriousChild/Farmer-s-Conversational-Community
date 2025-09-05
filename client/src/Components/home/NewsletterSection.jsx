import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  const newsItems = [
    {
      title: "New Government Subsidy for Organic Farming",
      date: "Dec 20, 2024",
      category: "Policy"
    },
    {
      title: "Revolutionary Disease-Resistant Rice Varieties",
      date: "Dec 18, 2024",
      category: "Technology"
    },
    {
      title: "Weather Alert: Prepare for Monsoon Season",
      date: "Dec 15, 2024",
      category: "Weather"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
                📧 Stay Informed
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Get the Latest
                <span className="block text-green-600 dark:text-green-400">
                  Agricultural News
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Subscribe to our newsletter for weekly updates on government schemes, 
                weather alerts, new farming technologies, and market prices.
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" className="gradient-green text-white hover:opacity-90">
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </form>
              ) : (
                <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Successfully subscribed!</span>
                  </div>
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    You'll receive our weekly newsletter with the latest farming updates.
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Join 5,000+ farmers who get our weekly updates. Unsubscribe anytime.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Updates
            </h3>
            
            {newsItems.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow dark:bg-gray-700 dark:border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{item.date}</span>
                        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}