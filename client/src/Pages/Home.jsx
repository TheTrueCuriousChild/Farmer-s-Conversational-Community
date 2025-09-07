import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Leaf,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Cloud,
  ShoppingCart,
  GraduationCap,
  Bug,
  Globe,
  Building2,
  HardHat,
  IndianRupee,
  MapPin,
  Calendar,
  BarChart3,
  Clock } from
"lucide-react";

const translations = {
  en: {
    welcome: "Welcome to Krishi Seva",
    subtitle: "Empowering farmers with technology, knowledge, and resources for sustainable agriculture",
    goToDashboard: "Go to Dashboard",
    learnMore: "Learn More",
    ourServices: "Our Services",
    servicesSubtitle: "Comprehensive solutions for modern agriculture",
    readyToTransform: "Ready to Transform Your Farming?",
    transformSubtitle: "Join thousands of farmers who are already benefiting from our platform",
    getStarted: "Get Started Today",
    explore: "Explore",
    selectLanguage: "Select Language",
    // Services
    weatherForecast: "Weather Forecast",
    weatherDesc: "Get accurate weather predictions for better farming decisions",
    diseaseDetection: "Disease Detection",
    diseaseDesc: "AI-powered crop disease identification and treatment suggestions",
    marketplace: "Marketplace",
    marketplaceDesc: "Buy and sell agricultural products directly with other farmers",
    farmEducation: "Farm Education",
    educationDesc: "Learn modern farming techniques and best practices",
    // Stats
    activeUsers: "Active Users",
    cropsMonitored: "Crops Monitored",
    yieldIncrease: "Yield Increase",
    successRate: "Success Rate",
    // Footer
    quickLinks: "Quick Links",
    support: "Support",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    allRightsReserved: "All Rights Reserved"
  },
  hi: {
    welcome: "कृषि सेवा में आपका स्वागत है",
    subtitle: "टिकाऊ कृषि के लिए प्रौद्योगिकी, ज्ञान और संसाधनों के साथ किसानों को सशक्त बनाना",
    goToDashboard: "डैशबोर्ड पर जाएं",
    learnMore: "और जानें",
    ourServices: "हमारी सेवाएं",
    servicesSubtitle: "आधुनिक कृषि के लिए व्यापक समाधान",
    readyToTransform: "अपनी खेती को बदलने के लिए तैयार हैं?",
    transformSubtitle: "हजारों किसानों से जुड़ें जो पहले से ही हमारे प्लेटफॉर्म से लाभान्वित हो रहे हैं",
    getStarted: "आज ही शुरू करें",
    explore: "अन्वेषण करें",
    selectLanguage: "भाषा चुनें",
    // Services
    weatherForecast: "मौसम पूर्वानुमान",
    weatherDesc: "बेहतर कृषि निर्णयों के लिए सटीक मौसम भविष्यवाणी प्राप्त करें",
    diseaseDetection: "रोग का पता लगाना",
    diseaseDesc: "AI-संचालित फसल रोग पहचान और उपचार सुझाव",
    marketplace: "बाजार",
    marketplaceDesc: "अन्य किसानों के साथ सीधे कृषि उत्पाद खरीदें और बेचें",
    farmEducation: "कृषि शिक्षा",
    educationDesc: "आधुनिक कृषि तकनीक और सर्वोत्तम प्रथाएं सीखें",
    // Stats
    activeUsers: "सक्रिय उपयोगकर्ता",
    cropsMonitored: "निगरानी में फसलें",
    yieldIncrease: "उत्पादन वृद्धि",
    successRate: "सफलता दर",
    // Footer
    quickLinks: "त्वरित लिंक",
    support: "सहायता",
    legal: "कानूनी",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    allRightsReserved: "सभी अधिकार सुरक्षित"
  },
  ml: {
    welcome: "കൃഷി സേവയിലേക്ക് സ്വാഗതം",
    subtitle: "സുസ്ഥിര കൃഷിക്കായി സാങ്കേതികവിദ്യ, അറിവ്, വിഭവങ്ങൾ എന്നിവ ഉപയോഗിച്ച് കർഷകരെ ശാക്തീകരിക്കുന്നു",
    goToDashboard: "ഡാഷ്ബോർഡിലേക്ക് പോകുക",
    learnMore: "കൂടുതൽ അറിയുക",
    ourServices: "ഞങ്ങളുടെ സേവനങ്ങൾ",
    servicesSubtitle: "ആധുനിക കൃഷിക്കുള്ള സമഗ്ര പരിഹാരങ്ങൾ",
    readyToTransform: "നിങ്ങളുടെ കൃഷി മാറ്റാൻ തയ്യാറാണോ?",
    transformSubtitle: "ഞങ്ങളുടെ പ്ലാറ്റ്ഫോമിൽ നിന്ന് ഇതിനകം പ്രയോജനം നേടുന്ന ആയിരക്കണക്കിന് കർഷകരോട് ചേരുക",
    getStarted: "ഇന്ന് തന്നെ ആരംഭിക്കുക",
    explore: "പര്യവേക്ഷണം ചെയ്യുക",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    // Services
    weatherForecast: "കാലാവസ്ഥാ പ്രവചനം",
    weatherDesc: "മെച്ചപ്പെട്ട കാർഷിക തീരുമാനങ്ങൾക്കായി കൃത്യമായ കാലാവസ്ഥാ പ്രവചനങ്ങൾ നേടുക",
    diseaseDetection: "രോഗ കണ്ടെത്തൽ",
    diseaseDesc: "AI-പ്രവർത്തിത വിള രോഗ തിരിച്ചറിയലും ചികിത്സാ നിർദ്ദേശങ്ങളും",
    marketplace: "മാർക്കറ്റ്പ്ലേസ്",
    marketplaceDesc: "മറ്റ് കർഷകരുമായി നേരിട്ട് കാർഷിക ഉൽപ്പന്നങ്ങൾ വാങ്ങുകയും വിൽക്കുകയും ചെയ്യുക",
    farmEducation: "കാർഷിക വിദ്യാഭ്യാസം",
    educationDesc: "ആധുനിക കൃഷി സാങ്കേതിക വിദ്യകളും മികച്ച പ്രവർത്തനങ്ങളും പഠിക്കുക",
    // Stats
    activeUsers: "സജീവ ഉപയോക്താക്കൾ",
    cropsMonitored: "നിരീക്ഷിക്കുന്ന വിളകൾ",
    yieldIncrease: "വിളവ് വർദ്ധനവ്",
    successRate: "വിജയ നിരക്ക്",
    // Footer
    quickLinks: "ദ്രുത ലിങ്കുകൾ",
    support: "പിന്തുണ",
    legal: "നിയമപരം",
    privacyPolicy: "സ്വകാര്യതാ നയം",
    termsOfService: "സേവന നിബന്ധനകൾ",
    allRightsReserved: "എല്ലാ അവകാശങ്ങളും പംരക്ഷിച്ചിരിക്കുന്നു"
  }
};

const Footer = ({ t }) =>
<footer className="bg-gray-800 text-white mt-8">
        <div className="max-w-6xl mx-auto py-8 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h3 className="font-bold mb-4">Krishi Seva</h3>
                    <p className="text-gray-400 text-sm">Empowering Indian farmers through technology.</p>
                </div>
                <div>
                    <h3 className="font-bold mb-4">{t.quickLinks}</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to={createPageUrl("Dashboard")} className="text-gray-400 hover:text-white">Dashboard</Link></li>
                        <li><Link to={createPageUrl("Marketplace")} className="text-gray-400 hover:text-white">Marketplace</Link></li>
                        <li><Link to={createPageUrl("Education")} className="text-gray-400 hover:text-white">Education</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">{t.support}</h3>
                     <ul className="space-y-2 text-sm">
                        <li><Link to={createPageUrl("Support")} className="text-gray-400 hover:text-white">FAQ</Link></li>
                        <li><Link to={createPageUrl("ContactUs")} className="text-gray-400 hover:text-white">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">{t.legal}</h3>
                     <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-400 hover:text-white">{t.privacyPolicy}</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">{t.termsOfService}</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Krishi Seva. {t.allRightsReserved}
            </div>
        </div>
    </footer>;


export default function Home({ language = 'en', translations: pageTranslations }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.user_role) {
        window.location.href = createPageUrl('Registration');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      window.location.href = createPageUrl('Registration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const features = [
  {
    icon: Cloud,
    title: t.weatherForecast,
    description: t.weatherDesc,
    link: "Weather"
  },
  {
    icon: Bug,
    title: t.diseaseDetection,
    description: t.diseaseDesc,
    link: "Disease"
  },
  {
    icon: ShoppingCart,
    title: t.marketplace,
    description: t.marketplaceDesc,
    link: "Marketplace"
  },
  {
    icon: GraduationCap,
    title: t.farmEducation,
    description: t.educationDesc,
    link: "Education"
  }];


  const stats = [
  { icon: Users, label: t.activeUsers, value: "10,000+" },
  { icon: Leaf, label: t.cropsMonitored, value: "50,000+" },
  { icon: TrendingUp, label: t.yieldIncrease, value: "25%" },
  { icon: Award, label: t.successRate, value: "95%" }];


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white py-20 px-6 rounded-2xl mb-8 overflow-hidden">
          {/* Hero Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=600&fit=crop')`
            }} />

          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t.welcome}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Dashboard")}>
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  {t.goToDashboard}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Education")}>
                <Button size="lg" variant="outline" className="bg-background text-green-600 px-8 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-11 rounded-md border-white hover:bg-white/10">
                  {t.learnMore}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-white dark:bg-gray-900 rounded-2xl mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) =>
              <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-950 rounded-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t.ourServices}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {t.servicesSubtitle}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) =>
              <Card key={index} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{feature.description}</p>
                    <Link to={createPageUrl(feature.link)} className="w-full block">
                      <Button variant="outline" className="bg-green-400 text-slate-50 px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-full dark:text-white dark:border-gray-600 dark:hover:bg-gray-800">
                        {t.explore}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer t={t} />
    </div>);

}