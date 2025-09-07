import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Edit, Loader2 } from "lucide-react";

const translations = {
  en: {
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    contactInfo: "Contact Information",
    email: "Email Address",
    phone: "Phone Number",
    farmInfo: "Farm Information",
    farmSize: "Farm Size",
    mainCrops: "Main Crops",
    farmingExp: "Farming Experience",
    farmLocation: "Farm Location",
    businessInfo: "Business Information",
    businessType: "Business Type",
    license: "License Number",
    taxId: "Tax ID",
    businessAddress: "Business Address",
    workInfo: "Work Information",
    workExp: "Work Experience",
    dailyWage: "Daily Wage",
    skills: "Skills",
    availability: "Availability",
    currentLocation: "Current Location",
    adminInfo: "Administrative Information",
    department: "Department",
    adminLevel: "Admin Level",
    responsibilities: "Responsibilities",
    years: "years",
    couldNotLoad: "Could not load profile. Please try again.",
    preferredLanguage: "Preferred Language"
  },
  hi: {
    myProfile: "मेरी प्रोफ़ाइल",
    editProfile: "प्रोफ़ाइल संपादित करें",
    contactInfo: "संपर्क जानकारी",
    email: "ईमेल पता",
    phone: "फ़ोन नंबर",
    farmInfo: "खेत की जानकारी",
    farmSize: "खेत का आकार",
    mainCrops: "मुख्य फसलें",
    farmingExp: "खेती का अनुभव",
    farmLocation: "खेत का स्थान",
    businessInfo: "व्यावसायिक जानकारी",
    businessType: "व्यवसाय का प्रकार",
    license: "लाइसेंस नंबर",
    taxId: "टैक्स आईडी",
    businessAddress: "व्यावसायिक पता",
    workInfo: "कार्य जानकारी",
    workExp: "कार्य अनुभव",
    dailyWage: "दैनिक मजदूरी",
    skills: "कौशल",
    availability: "उपलब्धता",
    currentLocation: "वर्तमान स्थान",
    adminInfo: "प्रशासनिक जानकारी",
    department: "विभाग",
    adminLevel: "एडमिन स्तर",
    responsibilities: "जिम्मेदारियाँ",
    years: "वर्ष",
    couldNotLoad: "प्रोफ़ाइल लोड नहीं हो सकी। कृपया पुनः प्रयास करें।",
    preferredLanguage: "पसंदीदा भाषा"
  },
  ml: {
    myProfile: "എൻ്റെ പ്രൊഫൈൽ",
    editProfile: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക",
    contactInfo: "ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ",
    email: "ഇമെയിൽ വിലാസം",
    phone: "ഫോൺ നമ്പർ",
    farmInfo: "ഫാം വിവരങ്ങൾ",
    farmSize: "ഫാമിന്റെ വലുപ്പം",
    mainCrops: "പ്രധാന വിളകൾ",
    farmingExp: "കൃഷി പരിചയം",
    farmLocation: "ഫാമിന്റെ സ്ഥാനം",
    businessInfo: "ബിസിനസ്സ് വിവരങ്ങൾ",
    businessType: "ബിസിനസ്സ് തരം",
    license: "ലൈസൻസ് നമ്പർ",
    taxId: "നികുതി ഐഡി",
    businessAddress: "ബിസിനസ്സ് വിലാസം",
    workInfo: "ജോലി വിവരങ്ങൾ",
    workExp: "പ്രവൃത്തി പരിചയം",
    dailyWage: "ദിവസ വേതനം",
    skills: "കഴിവുകൾ",
    availability: "ലഭ്യത",
    currentLocation: "നിലവിലെ സ്ഥാനം",
    adminInfo: "അഡ്മിനിസ്ട്രേറ്റീവ് വിവരങ്ങൾ",
    department: "വകുപ്പ്",
    adminLevel: "അഡ്മിൻ തലം",
    responsibilities: "ഉത്തരവാദിത്തങ്ങൾ",
    years: "വർഷം",
    couldNotLoad: "പ്രൊഫൈൽ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    preferredLanguage: "മുൻഗണനാ ഭാഷ"
  }
};

const DetailItem = ({ label, value }) => (
  value ? (
    <div>
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h4>
      <p className="text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  ) : null
);

export default function Profile({ language = 'en', translations: pageTranslations }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[language];

  useEffect(() => {
    const fetchUser = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  
  const formatAddress = (address) => {
      if (!address || !address.city) return null;
      return `${address.street || ''}, ${address.city}, ${address.state}, ${address.country}, ${address.zip_code || ''}`.replace(/^, /, '').replace(/, ,/g, ',');
  }

  const getLanguageName = (lang) => {
    const names = { en: 'English', hi: 'हिंदी', ml: 'മലയാളം' };
    return names[lang] || lang;
  };

  const renderRoleSpecificDetails = () => {
    if (!user) return null;

    switch (user.user_role) {
      case 'farmer':
        return (
          <Card className="mt-4 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">{t.farmInfo}</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <DetailItem label={t.farmSize} value={user.farm_size} />
              <DetailItem label={t.mainCrops} value={user.main_crops} />
              <DetailItem label={t.farmingExp} value={user.farming_experience && `${user.farming_experience} ${t.years}`} />
              <DetailItem label={t.farmLocation} value={formatAddress(user.farm_location)} />
            </CardContent>
          </Card>
        );
      case 'retailer':
        return (
          <Card className="mt-4 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">{t.businessInfo}</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <DetailItem label={t.businessType} value={user.business_type?.replace('_', ' ')} />
              <DetailItem label={t.license} value={user.license_number} />
              <DetailItem label={t.taxId} value={user.tax_id} />
              <DetailItem label={t.businessAddress} value={formatAddress(user.business_address)} />
            </CardContent>
          </Card>
        );
      case 'labourer':
        return (
          <Card className="mt-4 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">{t.workInfo}</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <DetailItem label={t.workExp} value={user.work_experience && `${user.work_experience} ${t.years}`} />
              <DetailItem label={t.dailyWage} value={user.daily_wage ? `₹${user.daily_wage}` : null} />
              <DetailItem label={t.skills} value={user.skills} />
              <DetailItem label={t.availability} value={user.availability} />
              <DetailItem label={t.currentLocation} value={formatAddress(user.current_location)} />
            </CardContent>
          </Card>
        );
      case 'admin':
        return (
          <Card className="mt-4 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">{t.adminInfo}</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <DetailItem label={t.department} value={user.department} />
              <DetailItem label={t.adminLevel} value={user.admin_level} />
              <DetailItem label={t.responsibilities} value={user.responsibilities} />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  const displayName = user?.farmer_name || user?.business_name || user?.labourer_name || user?.admin_name || user?.full_name;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <div className="p-6 text-gray-900 dark:text-white">{t.couldNotLoad}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.myProfile}</h1>
        <Button disabled className="bg-green-600 hover:bg-green-700 text-white">
          <Edit className="w-4 h-4 mr-2" />
          {t.editProfile}
        </Button>
      </div>

      <Card className="dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-green-600 dark:text-green-300" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold dark:text-white">{displayName}</h3>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1 capitalize">{user.user_role}</Badge>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <Card className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">{t.contactInfo}</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <DetailItem label={t.email} value={user.contact_email || user.email} />
              <DetailItem label={t.phone} value={user.phone} />
              <DetailItem label={t.preferredLanguage} value={getLanguageName(user.preferred_language)} />
            </CardContent>
          </Card>
          
          {renderRoleSpecificDetails()}
        </CardContent>
      </Card>
    </div>
  );
}