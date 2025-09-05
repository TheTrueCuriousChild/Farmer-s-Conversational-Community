
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Leaf, Search, Sun, Moon, Globe, Menu, X,
  Home, MessageSquare, Camera, CloudRain, BookOpen,
  ShoppingCart, User, FileText, HelpCircle, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User as UserEntity } from "@/entities/User";

const languages = {
  english: {
    home: "Home",
    community: "Community",
    diseaseChecker: "Disease Checker",
    weather: "Weather",
    education: "Education",
    marketplace: "Marketplace",
    profile: "Profile",
    schemes: "Schemes",
    support: "Support",
    login: "Login",
    signup: "Create Account",
    searchPlaceholder: "Search crops, diseases, weather...",
    lightMode: "Light Mode",
    darkMode: "Dark Mode"
  },
  hindi: {
    home: "होम",
    community: "समुदाय",
    diseaseChecker: "रोग जांचकर्ता",
    weather: "मौसम",
    education: "शिक्षा",
    marketplace: "बाज़ार",
    profile: "प्रोफाइल",
    schemes: "योजनाएं",
    support: "सहायता",
    login: "लॉगिन",
    signup: "खाता बनाएं",
    searchPlaceholder: "फसल, रोग, मौसम खोजें...",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड"
  },
  malayalam: {
    home: "ഹോം",
    community: "കമ്മ്യൂണിറ്റി",
    diseaseChecker: "രോഗ പരിശോധന",
    weather: "കാലാവസ്ഥ",
    education: "വിദ്യാഭ്യാസം",
    marketplace: "മാർക്കറ്റ്",
    profile: "പ്രൊഫൈൽ",
    schemes: "പദ്ധതികൾ",
    support: "പിന്തുണ",
    login: "ലോഗിൻ",
    signup: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    searchPlaceholder: "വിളകൾ, രോഗങ്ങൾ, കാലാവസ്ഥ തിരയുക...",
    lightMode: "ലൈറ്റ് മോഡ്",
    darkMode: "ഡാർക്ക് മോഡ്"
  }
};

export default function Layout({ children, currentPageName }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const t = languages[language];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await UserEntity.me();
        setUser(userData);

        // Redirect new users to complete their profile
        if (!userData.user_type && currentPageName !== 'CompleteProfile') {
          navigate(createPageUrl("CompleteProfile"));
        }

        if (userData.language_preference) {
          setLanguage(userData.language_preference);
        }
      } catch (error) {
        setUser(null);
      }
    };

    loadUser();

    const savedTheme = localStorage.getItem('krishiseva-theme');
    const savedLanguage = localStorage.getItem('krishiseva-language');

    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    if (savedLanguage && languages[savedLanguage]) setLanguage(savedLanguage);
  }, [currentPageName, navigate]);

  const handleLogin = () => {
    UserEntity.login();
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('krishiseva-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('krishiseva-theme', 'light');
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('krishiseva-language', newLanguage);

    if (user) {
      try {
        await UserEntity.updateMyUserData({ language_preference: newLanguage });
      } catch (error) {
        console.log("Could not save language preference");
      }
    }
  };

  const navigationItems = [
    { name: t.home, path: "Home", icon: Home },
    { name: t.community, path: "Community", icon: MessageSquare },
    { name: t.diseaseChecker, path: "DiseaseChecker", icon: Camera },
    { name: t.weather, path: "Weather", icon: CloudRain },
    { name: t.education, path: "Education", icon: BookOpen },
    { name: t.marketplace, path: "Marketplace", icon: ShoppingCart },
    { name: t.schemes, path: "GovernmentSchemes", icon: Bell },
    { name: t.support, path: "Support", icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <style>{`
        :root {
          --primary-green: #22c55e;
          --primary-green-dark: #16a34a;
          --secondary-green: #dcfce7;
          --accent-green: #bbf7d0;
        }

        .dark {
          --primary-green: #4ade80;
          --primary-green-dark: #22c55e;
          --secondary-green: #052e16;
          --accent-green: #14532d;
        }

        .gradient-green {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%);
        }

        .gradient-green-subtle {
          background: linear-gradient(135deg, var(--secondary-green) 0%, var(--accent-green) 100%);
        }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                KrishiSeva
              </h1>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  placeholder={t.searchPlaceholder}
                  className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className={`w-32 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}>
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिन्दी</SelectItem>
                  <SelectItem value="malayalam">മലയാളം</SelectItem>
                </SelectContent>
              </Select>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Profile or Login */}
              {user ? (
                <Link to={createPageUrl("Profile")}>
                  <Button variant="ghost" size="icon" className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Button variant="ghost" onClick={handleLogin}>
                    {t.login}
                  </Button>
                  <Button className="gradient-green text-white hover:opacity-90" onClick={handleLogin}>
                      {t.signup}
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                  <SheetHeader>
                    <SheetTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Leaf className="w-5 h-5 text-green-500" />
                      KrishiSeva
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8 space-y-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={createPageUrl(item.path)}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                          location.pathname === createPageUrl(item.path)
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    ))}
                    {!user && (
                      <div className="pt-4 space-y-2">
                        <Button className="w-full" variant="ghost" onClick={() => { handleLogin(); setMobileMenuOpen(false); }}>
                          {t.login}
                        </Button>
                        <Button className="w-full gradient-green text-white" onClick={() => { handleLogin(); setMobileMenuOpen(false); }}>
                          {t.signup}
                        </Button>
                      </div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden md:block border-t border-gray-100 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === createPageUrl(item.path)
                      ? 'text-green-700 border-b-2 border-green-500'
                      : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-20 border-t transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  KrishiSeva
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Empowering farmers with technology for sustainable agriculture and better livelihoods.
              </p>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Features
              </h4>
              <div className="space-y-2">
                <Link to={createPageUrl("DiseaseChecker")} className={`block text-sm hover:text-green-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Disease Detection
                </Link>
                <Link to={createPageUrl("Weather")} className={`block text-sm hover:text-green-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Weather Forecast
                </Link>
                <Link to={createPageUrl("Marketplace")} className={`block text-sm hover:text-green-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Marketplace
                </Link>
              </div>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Support
              </h4>
              <div className="space-y-2">
                <Link to={createPageUrl("Support")} className={`block text-sm hover:text-green-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Help Center
                </Link>
                <Link to={createPageUrl("Community")} className={`block text-sm hover:text-green-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Community
                </Link>
              </div>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                support@krishiseva.com
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                +91 9876543210
              </p>
            </div>
          </div>

          <div className={`mt-8 pt-8 border-t text-center text-sm ${
            darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          }`}>
            <p>&copy; 2024 KrishiSeva. All rights reserved. Made with ❤️ for farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
