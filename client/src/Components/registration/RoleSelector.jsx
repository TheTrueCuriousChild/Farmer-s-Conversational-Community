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

const roleTranslations = {
  en: {
    farmer: { name: "Farmer", desc: "Agricultural producer and cultivator" },
    admin: { name: "Admin", desc: "System administrator and manager" },
    retailer: { name: "Retailer", desc: "Business owner and seller" },
    labourer: { name: "Labourer", desc: "Agricultural worker and assistant" },
    chooseRole: "Choose Your Role"
  },
  hi: {
    farmer: { name: "किसान", desc: "कृषि उत्पादक और कृषक" },
    admin: { name: "एडमिन", desc: "सिस्टम प्रबंधक और मैनेजर" },
    retailer: { name: "रिटेलर", desc: "व्यापार मालिक और विक्रेता" },
    labourer: { name: "मजदूर", desc: "कृषि कार्यकर्ता और सहायक" },
    chooseRole: "अपनी भूमिका चुनें"
  },
  ml: {
    farmer: { name: "കർഷകൻ", desc: "കാർഷിക ഉൽപ്പാദകനും കൃഷിക്കാരനും" },
    admin: { name: "അഡ്മിൻ", desc: "സിസ്റ്റം അഡ്മിനിസ്ട്രേറ്ററും മാനേജറും" },
    retailer: { name: "റീട്ടെയിലർ", desc: "ബിസിനസ്സ് ഉടമയും വിൽപ്പനക്കാരനും" },
    labourer: { name: "തൊഴിലാളി", desc: "കാർഷിക തൊഴിലാളിയും സഹായിയും" },
    chooseRole: "നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക"
  }
};

export default function RoleSelector({ selectedRole, onRoleSelect, language, translations }) {
  const roles = ['farmer', 'admin', 'retailer', 'labourer'];
  const roleTexts = roleTranslations[language];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">{roleTexts.chooseRole}</h2>
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
                  <h3 className={`font-semibold mb-1 ${
                    isSelected ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {roleTexts[role].name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {roleTexts[role].desc}
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