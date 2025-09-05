import React from "react";
import { Users, Globe, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    number: "10,000+",
    label: "Active Farmers",
    icon: Users,
    description: "Farmers using our platform daily"
  },
  {
    number: "500+",
    label: "Villages Covered",
    icon: Globe,
    description: "Rural communities we serve"
  },
  {
    number: "95%",
    label: "Accuracy Rate",
    icon: Award,
    description: "Disease detection accuracy"
  },
  {
    number: "40%",
    label: "Yield Improvement",
    icon: TrendingUp,
    description: "Average crop yield increase"
  }
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Farmers Worldwide
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Our platform has helped thousands of farmers improve their yields and livelihoods
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-colors">
                <stat.icon className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-green-100 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-green-200">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}