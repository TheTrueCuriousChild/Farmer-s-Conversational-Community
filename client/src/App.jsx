import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LayoutDashboard,
  Home,
  Leaf,
  GraduationCap,
  Calendar,
  Building2,
  ShoppingCart,
  User as UserIcon,
  HardHat,
  HelpCircle,
  Cloud,
  Phone,
  Bug,
  Menu,
  Sun,
  Moon,
  MessageCircle,
  Image as ImageIcon,
  Users,
  Globe } from
"lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger } from
"@/components/ui/sidebar";

const translations = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    profile: "Profile",
    chatbot: "AI Assistant",
    community: "Community",
    farmPlanning: "Farm Planning",
    diseaseDetection: "Disease Detection",
    produceGallery: "Produce Gallery",
    education: "Education",
    weather: "Weather",
    marketplace: "Marketplace",
    government: "Government Schemes",
    farmers: "Farmers",
    retailers: "Retailers",
    labourers: "Labourers",
    support: "Support",
    contactUs: "Contact Us",
    krishiSeva: "Krishi Seva",
    smartAgriculture: "Smart Agriculture",
    selectLanguage: "Language"
  },
  hi: {
    home: "होम",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    chatbot: "एआई सहायक",
    community: "समुदाय",
    farmPlanning: "कृषि योजना",
    diseaseDetection: "रोग पहचान",
    produceGallery: "उत्पादन गैलरी",
    education: "शिक्षा",
    weather: "मौसम",
    marketplace: "बाजार",
    government: "सरकारी योजनाएं",
    farmers: "किसान",
    retailers: "खुदरा विक्रेता",
    labourers: "मजदूर",
    support: "सहायता",
    contactUs: "संपर्क करें",
    krishiSeva: "कृषि सेवा",
    smartAgriculture: "स्मार्ट कृषि",
    selectLanguage: "भाषा"
  },
  ml: {
    home: "ഹോം",
    dashboard: "ഡാഷ്ബോർഡ്",
    profile: "പ്രൊഫൈൽ",
    chatbot: "AI സഹായി",
    community: "കമ്മ്യൂണിറ്റി",
    farmPlanning: "കാർഷിക ആസൂത്രണം",
    diseaseDetection: "രോഗ കണ്ടെത്തൽ",
    produceGallery: "ഉൽപ്പന്ന ഗാലറി",
    education: "വിദ്യാഭ്യാസം",
    weather: "കാലാവസ്ഥ",
    marketplace: "മാർക്കറ്റ്പ്ലേസ്",
    government: "സർക്കാർ പദ്ധതികൾ",
    farmers: "കർഷകർ",
    retailers: "റീട്ടെയിലർമാർ",
    labourers: "തൊഴിലാളികൾ",
    support: "പിന്തുണ",
    contactUs: "ബന്ധപ്പെടുക",
    krishiSeva: "കൃഷി സേവ",
    smartAgriculture: "സ്മാർട് അഗ്രിക്കൾച്ചർ",
    selectLanguage: "ഭാഷ"
  }
};

const allNavItems = [
{ title: "home", url: createPageUrl("Home"), icon: Home, roles: ['farmer', 'retailer', 'labourer', 'admin'] },
{ title: "dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard, roles: ['farmer', 'retailer', 'labourer', 'admin'] },
{ title: "profile", url: createPageUrl("Profile"), icon: UserIcon, roles: ['farmer', 'retailer', 'labourer', 'admin'] },
{ title: "chatbot", url: createPageUrl("Chatbot"), icon: MessageCircle, roles: ['farmer', 'retailer', 'labourer', 'admin'] },
{ title: "community", url: createPageUrl("Community"), icon: Users, roles: ['farmer', 'retailer', 'labourer', 'admin'] },
{ title: "farmPlanning", url: createPageUrl("FarmPlanning"), icon: Calendar, roles: ['farmer'] },
{ title: "diseaseDetection", url: createPageUrl("Disease"), icon: Bug, roles: ['farmer'] },
{ title: "produceGallery", url: createPageUrl("ImageGallery"), icon: ImageIcon, roles: ['farmer'] },
{ title: "education", url: createPageUrl("Education"), icon: GraduationCap, roles: ['farmer', 'retailer', 'labourer', 'admin'] },
{ title: "weather", url: createPageUrl("Weather"), icon: Cloud, roles: ['farmer', 'labourer'] },
{ title: "marketplace", url: createPageUrl("Marketplace"), icon: ShoppingCart, roles: ['farmer', 'retailer'] },
{ title: "government", url: createPageUrl("Government"), icon: Building2, roles: ['farmer'] },
{ title: "farmers", url: createPageUrl("FarmerPage"), icon: Leaf, roles: ['retailer', 'labourer', 'admin'] },
{ title: "retailers", url: createPageUrl("RetailerPage"), icon: ShoppingCart, roles: ['farmer', 'admin'] },
{ title: "labourers", url: createPageUrl("LabourerPage"), icon: HardHat, roles: ['farmer', 'admin'] },
{ title: "support", url: createPageUrl("Support"), icon: HelpCircle, roles: ['farmer', 'retailer', 'labourer', 'admin'] },
{ title: "contactUs", url: createPageUrl("ContactUs"), icon: Phone, roles: ['farmer', 'retailer', 'labourer', 'admin'] }];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [navigationItems, setNavigationItems] = useState([]);
  const [language, setLanguage] = useState('en');

  const t = translations[language];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (location.pathname.includes(createPageUrl('Registration'))) {
      return;
    }

    const fetchUserAndSetNav = async () => {
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) {
          window.location.href = createPageUrl('Registration');
          return;
        }
        const currentUser = JSON.parse(currentUserStr);
        setUser(currentUser);

        // Set language from user preference
        if (currentUser.preferred_language) {
          setLanguage(currentUser.preferred_language);
        }

        if (currentUser && currentUser.user_role) {
          const filteredNav = allNavItems.filter((item) => item.roles.includes(currentUser.user_role));
          setNavigationItems(filteredNav);
        } else {
          window.location.href = createPageUrl('Registration');
        }
      } catch (error) {
        console.log("User data parsing error or not logged in, redirecting to registration.");
        window.location.href = createPageUrl('Registration');
      }
    };
    fetchUserAndSetNav();
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Update user's language preference
    if (user) {
      const updatedUser = { ...user, preferred_language: newLanguage };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "Guest";
    return user.farmer_name || user.business_name || user.labourer_name || user.admin_name || user.full_name || "User";
  };

  const getUserRoleDisplayName = () => {
    if (!user || !user.user_role) return "";
    return user.user_role.charAt(0).toUpperCase() + user.user_role.slice(1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{t.krishiSeva}</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t.smartAgriculture}</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-lime-600 text-slate-50 px-3 py-2 text-sm flex h-10 items-center justify-between rounded-md border ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="ml">മലയാളം</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="bg-slate-900 text-green-500 p-2 flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) =>
                  <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                      asChild
                      className={`hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 rounded-lg mb-1 ${
                      location.pathname === item.url ? 'bg-green-100 dark:bg-gray-800 text-green-700 dark:text-green-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`
                      }>

                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
                          <item.icon className="w-4 h-4" />
                          <span>{t[item.title]}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{getUserRoleDisplayName()}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{currentPageName || t.krishiSeva}</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            {React.cloneElement(children, { language, translations: translations[language] })}
          </div>
        </main>
      </div>
    </SidebarProvider>);

}