import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShoppingCart, Briefcase, HardHat } from 'lucide-react';

const roleIcons = {
  farmer: Users,
  admin: Briefcase,
  retailer: ShoppingCart,
  labourer: HardHat
};

const roleDescriptions = {
  farmer: "Agricultural producer and cultivator",
  admin: "System administrator and manager",
  retailer: "Business owner and seller",
  labourer: "Agricultural worker and assistant"
};

export default function RoleSelector({ selectedRole, onRoleSelect }) {
  const roles = ['farmer', 'admin', 'retailer', 'labourer'];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Choose Your Role</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const Icon = roleIcons[role];
          const isSelected = selectedRole === role;
          
          return (
            <motion.div
              key={role}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                    : 'hover:border-green-300 hover:shadow-lg'
                }`}
                onClick={() => onRoleSelect(role)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className={`font-semibold capitalize mb-1 ${
                    isSelected ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {role}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {roleDescriptions[role]}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}