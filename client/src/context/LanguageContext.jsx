import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('krishiseva-language');
    if (savedLanguage && ['en', 'ml'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (['en', 'ml'].includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem('krishiseva-language', newLanguage);
    }
  };

  const value = {
    language,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation object
export const translations = {
  en: {
    // Navigation
    home: "Home",
    chatbot: "Chatbot",
    contact: "Contact",
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    logout: "Logout",
    
    // Homepage
    welcomeTitle: "Welcome to KrishiSeva",
    welcomeSubtitle: "Your comprehensive agricultural platform for modern farming",
    welcomeDescription: "Whether you're a farmer, retailer, laborer, or admin, we have the tools and community you need to succeed.",
    getStarted: "Get Started",
    tryChatbot: "Try Our Chatbot",
    
    // Features
    whyChoose: "Why Choose KrishiSeva?",
    featuresDescription: "Comprehensive tools and features designed for the agricultural community",
    aiChatbot: "AI Chatbot",
    aiChatbotDesc: "Get instant answers to your farming questions with our intelligent AI assistant.",
    community: "Community",
    communityDesc: "Connect with fellow farmers, share experiences, and learn from each other.",
    analytics: "Analytics",
    analyticsDesc: "Track your farm performance with detailed analytics and insights.",
    secure: "Secure",
    secureDesc: "Your data is protected with enterprise-grade security measures.",
    
    // User Roles
    forEveryRole: "For Every Role in Agriculture",
    rolesDescription: "Tailored experiences for different members of the farming community",
    farmer: "Farmer",
    farmerDesc: "Manage your farm, get crop advice, and connect with buyers.",
    retailer: "Retailer",
    retailerDesc: "Source fresh produce directly from farmers and manage your inventory.",
    laborer: "Laborer",
    laborerDesc: "Find work opportunities and showcase your farming skills.",
    admin: "Admin",
    adminDesc: "Manage the platform and support the farming community.",
    
    // CTA Section
    readyToTransform: "Ready to Transform Your Agricultural Journey?",
    joinThousands: "Join thousands of farmers, retailers, and agricultural professionals who trust KrishiSeva.",
    
    // Contact Section
    needHelp: "Need Help? We're Here for You",
    supportDescription: "Our support team is ready to assist you with any questions or concerns.",
    callUs: "Call Us",
    emailUs: "Email Us",
    contactSupport: "Contact Support",
    
    // Footer
    features: "Features",
    diseaseDetection: "Disease Detection",
    weatherForecast: "Weather Forecast",
    marketplace: "Marketplace",
    support: "Support",
    helpCenter: "Help Center",
    community: "Community",
    contact: "Contact",
    allRightsReserved: "All rights reserved. Made with ❤️ for farmers.",
    
    // Dashboard
    welcomeBack: "Welcome back",
    dashboard: "Dashboard",
    quickActions: "Quick Actions",
    recentActivities: "Recent Activities",
    farmingTips: "Farming Tips",
    todaysTip: "Today's Tip",
    marketInsights: "Market Insights",
    marketUpdate: "Market Update",
    availableJobs: "Available Jobs",
    jobAlert: "Job Alert",
    systemStatus: "System Status",
    systemHealth: "System Health",
    
    // Contact Page
    contactUs: "Contact Us",
    getInTouch: "Get in Touch",
    choosePreferred: "We're here to help! Choose your preferred way to get in touch with our support team.",
    callUsTitle: "Call Us",
    callUsDesc: "Speak directly with our support team",
    callNow: "Call Now",
    whatsappTitle: "WhatsApp",
    whatsappDesc: "Chat with us on WhatsApp",
    startChat: "Start Chat",
    emailTitle: "Email Us",
    emailDesc: "Send us an email and we'll respond within 24 hours",
    sendEmail: "Send Email",
    messageTitle: "Send Message",
    messageDesc: "Leave us a message through our contact form",
    sendMessage: "Send Message",
    contactInfo: "Contact Information",
    businessHours: "Business Hours",
    mondayFriday: "Monday - Friday: 9:00 AM - 6:00 PM",
    saturday: "Saturday: 10:00 AM - 4:00 PM",
    sunday: "Sunday: Closed",
    sendUsMessage: "Send us a Message",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address",
    message: "Message",
    tellUsHow: "Tell us how we can help you...",
    quickResponse: "Quick Response",
    quickResponseDesc: "We typically respond within 2-4 hours during business hours.",
    emergencySupport: "Emergency Support",
    emergencyDesc: "For urgent agricultural issues, call our 24/7 helpline at",
    
    // Chatbot
    aiFarmingAssistant: "AI Farming Assistant",
    askMeAnything: "Ask me anything about farming, crops, weather, or agricultural practices",
    online: "Online",
    quickQuestions: "Quick Questions",
    askMeFarming: "Ask me anything about farming...",
    aiThinking: "AI is thinking...",
    whatICanHelp: "What I can help you with:",
    weatherForecasts: "Weather forecasts and farming advice",
    cropDisease: "Crop disease and pest identification",
    fertilizerSoil: "Fertilizer and soil management",
    marketPrices: "Market prices and trends",
    plantingHarvesting: "Planting and harvesting schedules",
    governmentSchemes: "Government schemes and subsidies",
    
    // Login/Register
    signInAccount: "Sign in to your account",
    createAccount: "Create your account",
    or: "Or",
    signInExisting: "sign in to your existing account",
    createNew: "create a new account",
    selectRole: "Select Your Role",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address (Optional)",
    state: "State",
    district: "District",
    villageTown: "Village/Town",
    pincode: "Pincode",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot your password?",
    signIn: "Sign in",
    creatingAccount: "Creating account...",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    view: "View",
    details: "Details",
    more: "More",
    less: "Less"
  },
  
  ml: {
    // Navigation
    home: "ഹോം",
    chatbot: "ചാറ്റ്ബോട്ട്",
    contact: "ബന്ധപ്പെടുക",
    login: "ലോഗിൻ",
    register: "രജിസ്റ്റർ",
    dashboard: "ഡാഷ്ബോർഡ്",
    logout: "ലോഗ് ഔട്ട്",
    
    // Homepage
    welcomeTitle: "ക്രിഷിസേവയിലേക്ക് സ്വാഗതം",
    welcomeSubtitle: "ആധുനിക കൃഷിക്കുള്ള നിങ്ങളുടെ സമഗ്ര കാർഷിക പ്ലാറ്റ്ഫോം",
    welcomeDescription: "നിങ്ങൾ കർഷകനാണെങ്കിലും, റീടെയിലറാണെങ്കിലും, തൊഴിലാളിയാണെങ്കിലും, അഡ്മിനാണെങ്കിലും, വിജയിക്കാൻ നിങ്ങൾക്ക് ആവശ്യമായ ഉപകരണങ്ങളും കമ്മ്യൂണിറ്റിയും ഞങ്ങൾക്കുണ്ട്.",
    getStarted: "ആരംഭിക്കുക",
    tryChatbot: "ഞങ്ങളുടെ ചാറ്റ്ബോട്ട് പരീക്ഷിക്കുക",
    
    // Features
    whyChoose: "എന്തുകൊണ്ട് ക്രിഷിസേവ?",
    featuresDescription: "കാർഷിക കമ്മ്യൂണിറ്റിക്കായി രൂപകൽപ്പന ചെയ്ത സമഗ്ര ഉപകരണങ്ങളും സവിശേഷതകളും",
    aiChatbot: "AI ചാറ്റ്ബോട്ട്",
    aiChatbotDesc: "നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾക്ക് ഞങ്ങളുടെ ബുദ്ധിമാനായ AI അസിസ്റ്റന്റിൽ നിന്ന് തൽക്ഷണ ഉത്തരങ്ങൾ നേടുക.",
    community: "കമ്മ്യൂണിറ്റി",
    communityDesc: "സഹ കർഷകരുമായി ബന്ധപ്പെടുക, അനുഭവങ്ങൾ പങ്കിടുക, പരസ്പരം പഠിക്കുക.",
    analytics: "വിശകലനം",
    analyticsDesc: "വിശദമായ വിശകലനവും ഉൾക്കാഴ്ചകളും ഉപയോഗിച്ച് നിങ്ങളുടെ കൃഷി പ്രകടനം ട്രാക്ക് ചെയ്യുക.",
    secure: "സുരക്ഷിതം",
    secureDesc: "നിങ്ങളുടെ ഡാറ്റ എന്റർപ്രൈസ്-ഗ്രേഡ് സുരക്ഷാ നടപടികളാൽ സംരക്ഷിക്കപ്പെട്ടിരിക്കുന്നു.",
    
    // User Roles
    forEveryRole: "കാർഷികത്തിലെ എല്ലാ പങ്കാളിത്തത്തിനും",
    rolesDescription: "കൃഷി കമ്മ്യൂണിറ്റിയിലെ വ്യത്യസ്ത അംഗങ്ങൾക്കായി രൂപകൽപ്പന ചെയ്ത അനുഭവങ്ങൾ",
    farmer: "കർഷകൻ",
    farmerDesc: "നിങ്ങളുടെ കൃഷിസ്ഥലം നിയന്ത്രിക്കുക, വിള ഉപദേശം നേടുക, വാങ്ങുന്നവരുമായി ബന്ധപ്പെടുക.",
    retailer: "റീടെയിലർ",
    retailerDesc: "കർഷകരിൽ നിന്ന് നേരിട്ട് പുതിയ ഉൽപ്പന്നങ്ങൾ സ്രോതസ്സ് ചെയ്യുക, നിങ്ങളുടെ ഇൻവെന്ററി നിയന്ത്രിക്കുക.",
    laborer: "തൊഴിലാളി",
    laborerDesc: "ജോലി അവസരങ്ങൾ കണ്ടെത്തുക, നിങ്ങളുടെ കൃഷി കഴിവുകൾ പ്രദർശിപ്പിക്കുക.",
    admin: "അഡ്മിൻ",
    adminDesc: "പ്ലാറ്റ്ഫോം നിയന്ത്രിക്കുക, കൃഷി കമ്മ്യൂണിറ്റിയെ പിന്തുണയ്ക്കുക.",
    
    // CTA Section
    readyToTransform: "നിങ്ങളുടെ കാർഷിക യാത്ര മാറ്റാൻ തയ്യാറാണോ?",
    joinThousands: "ക്രിഷിസേവയിൽ വിശ്വസിക്കുന്ന ആയിരക്കണക്കിന് കർഷകരുടെയും റീടെയിലറുകളുടെയും കാർഷിക പ്രൊഫഷണലുകളുടെയും കൂടെ ചേരുക.",
    
    // Contact Section
    needHelp: "സഹായം വേണോ? ഞങ്ങൾ ഇവിടെയുണ്ട്",
    supportDescription: "ഏത് ചോദ്യങ്ങളോ ആശങ്കകളോ ഉണ്ടെങ്കിൽ നിങ്ങളെ സഹായിക്കാൻ ഞങ്ങളുടെ പിന്തുണാ ടീം തയ്യാറാണ്.",
    callUs: "ഞങ്ങളെ വിളിക്കുക",
    emailUs: "ഞങ്ങൾക്ക് ഇമെയിൽ അയയ്ക്കുക",
    contactSupport: "പിന്തുണയുമായി ബന്ധപ്പെടുക",
    
    // Footer
    features: "സവിശേഷതകൾ",
    diseaseDetection: "രോഗ പരിശോധന",
    weatherForecast: "കാലാവസ്ഥ പ്രവചനം",
    marketplace: "മാർക്കറ്റ്",
    support: "പിന്തുണ",
    helpCenter: "സഹായ കേന്ദ്രം",
    community: "കമ്മ്യൂണിറ്റി",
    contact: "ബന്ധപ്പെടുക",
    allRightsReserved: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം. കർഷകരുടെ സ്നേഹത്തോടെ നിർമ്മിച്ചത്.",
    
    // Dashboard
    welcomeBack: "വീണ്ടും സ്വാഗതം",
    dashboard: "ഡാഷ്ബോർഡ്",
    quickActions: "ദ്രുത പ്രവർത്തനങ്ങൾ",
    recentActivities: "സമീപകാല പ്രവർത്തനങ്ങൾ",
    farmingTips: "കൃഷി നുറുങ്ങുകൾ",
    todaysTip: "ഇന്നത്തെ നുറുങ്ങ്",
    marketInsights: "മാർക്കറ്റ് ഉൾക്കാഴ്ചകൾ",
    marketUpdate: "മാർക്കറ്റ് അപ്ഡേറ്റ്",
    availableJobs: "ലഭ്യമായ ജോലികൾ",
    jobAlert: "ജോലി അലേർട്ട്",
    systemStatus: "സിസ്റ്റം നില",
    systemHealth: "സിസ്റ്റം ആരോഗ്യം",
    
    // Contact Page
    contactUs: "ഞങ്ങളുമായി ബന്ധപ്പെടുക",
    getInTouch: "ബന്ധപ്പെടുക",
    choosePreferred: "സഹായിക്കാൻ ഞങ്ങൾ ഇവിടെയുണ്ട്! ഞങ്ങളുടെ പിന്തുണാ ടീമുമായി ബന്ധപ്പെടാൻ നിങ്ങൾ തിരഞ്ഞെടുക്കുന്ന രീതി തിരഞ്ഞെടുക്കുക.",
    callUsTitle: "ഞങ്ങളെ വിളിക്കുക",
    callUsDesc: "ഞങ്ങളുടെ പിന്തുണാ ടീമുമായി നേരിട്ട് സംസാരിക്കുക",
    callNow: "ഇപ്പോൾ വിളിക്കുക",
    whatsappTitle: "വാട്സ്ആപ്പ്",
    whatsappDesc: "വാട്സ്ആപ്പിൽ ഞങ്ങളുമായി ചാറ്റ് ചെയ്യുക",
    startChat: "ചാറ്റ് ആരംഭിക്കുക",
    emailTitle: "ഞങ്ങൾക്ക് ഇമെയിൽ അയയ്ക്കുക",
    emailDesc: "ഞങ്ങൾക്ക് ഇമെയിൽ അയയ്ക്കുക, 24 മണിക്കൂറിനുള്ളിൽ ഞങ്ങൾ മറുപടി നൽകും",
    sendEmail: "ഇമെയിൽ അയയ്ക്കുക",
    messageTitle: "സന്ദേശം അയയ്ക്കുക",
    messageDesc: "ഞങ്ങളുടെ കോൺടാക്റ്റ് ഫോമിലൂടെ ഞങ്ങൾക്ക് ഒരു സന്ദേശം അയയ്ക്കുക",
    sendMessage: "സന്ദേശം അയയ്ക്കുക",
    contactInfo: "കോൺടാക്റ്റ് വിവരങ്ങൾ",
    businessHours: "ബിസിനസ് സമയം",
    mondayFriday: "തിങ്കൾ - വെള്ളി: 9:00 AM - 6:00 PM",
    saturday: "ശനി: 10:00 AM - 4:00 PM",
    sunday: "ഞായർ: അടച്ചിരിക്കുന്നു",
    sendUsMessage: "ഞങ്ങൾക്ക് ഒരു സന്ദേശം അയയ്ക്കുക",
    fullName: "പൂർണ്ണ നാമം",
    phoneNumber: "ഫോൺ നമ്പർ",
    emailAddress: "ഇമെയിൽ വിലാസം",
    message: "സന്ദേശം",
    tellUsHow: "ഞങ്ങൾക്ക് എങ്ങനെ സഹായിക്കാമെന്ന് പറയുക...",
    quickResponse: "ദ്രുത പ്രതികരണം",
    quickResponseDesc: "ബിസിനസ് സമയത്ത് 2-4 മണിക്കൂറിനുള്ളിൽ ഞങ്ങൾ സാധാരണയായി മറുപടി നൽകുന്നു.",
    emergencySupport: "അടിയന്തിര പിന്തുണ",
    emergencyDesc: "അടിയന്തിര കാർഷിക പ്രശ്നങ്ങൾക്ക്, ഞങ്ങളുടെ 24/7 ഹെൽപ്പ്ലൈനിൽ വിളിക്കുക",
    
    // Chatbot
    aiFarmingAssistant: "AI കൃഷി അസിസ്റ്റന്റ്",
    askMeAnything: "കൃഷി, വിളകൾ, കാലാവസ്ഥ, അല്ലെങ്കിൽ കാർഷിക പരിശീലനങ്ങളെക്കുറിച്ച് എന്തും ചോദിക്കുക",
    online: "ഓൺലൈൻ",
    quickQuestions: "ദ്രുത ചോദ്യങ്ങൾ",
    askMeFarming: "കൃഷിയെക്കുറിച്ച് എന്തും ചോദിക്കുക...",
    aiThinking: "AI ചിന്തിക്കുന്നു...",
    whatICanHelp: "എനിക്ക് സഹായിക്കാൻ കഴിയുന്നത്:",
    weatherForecasts: "കാലാവസ്ഥ പ്രവചനങ്ങളും കൃഷി ഉപദേശങ്ങളും",
    cropDisease: "വിള രോഗങ്ങളും കീടങ്ങളും തിരിച്ചറിയൽ",
    fertilizerSoil: "വളവും മണ്ണ് മാനേജ്മെന്റും",
    marketPrices: "മാർക്കറ്റ് വിലകളും പ്രവണതകളും",
    plantingHarvesting: "നടൽ, വിളവെടുപ്പ് ഷെഡ്യൂളുകൾ",
    governmentSchemes: "സർക്കാർ പദ്ധതികളും സബ്സിഡികളും",
    
    // Login/Register
    signInAccount: "നിങ്ങളുടെ അക്കൗണ്ടിൽ സൈൻ ഇൻ ചെയ്യുക",
    createAccount: "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    or: "അല്ലെങ്കിൽ",
    signInExisting: "നിങ്ങളുടെ നിലവിലുള്ള അക്കൗണ്ടിൽ സൈൻ ഇൻ ചെയ്യുക",
    createNew: "ഒരു പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    selectRole: "നിങ്ങളുടെ പങ്കാളിത്തം തിരഞ്ഞെടുക്കുക",
    fullName: "പൂർണ്ണ നാമം",
    phoneNumber: "ഫോൺ നമ്പർ",
    emailAddress: "ഇമെയിൽ വിലാസം (ഓപ്ഷണൽ)",
    state: "സംസ്ഥാനം",
    district: "ജില്ല",
    villageTown: "ഗ്രാമം/പട്ടണം",
    pincode: "പിൻകോഡ്",
    password: "പാസ്‌വേഡ്",
    confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    rememberMe: "എന്നെ ഓർക്കുക",
    forgotPassword: "നിങ്ങളുടെ പാസ്‌വേഡ് മറന്നുപോയി?",
    signIn: "സൈൻ ഇൻ",
    creatingAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു...",
    
    // Common
    loading: "ലോഡ് ചെയ്യുന്നു...",
    error: "പിശക്",
    success: "വിജയം",
    cancel: "റദ്ദാക്കുക",
    save: "സേവ് ചെയ്യുക",
    edit: "എഡിറ്റ് ചെയ്യുക",
    delete: "ഡിലീറ്റ് ചെയ്യുക",
    close: "അടയ്ക്കുക",
    back: "തിരികെ",
    next: "അടുത്തത്",
    previous: "മുമ്പത്തേത്",
    submit: "സബ്മിറ്റ് ചെയ്യുക",
    search: "തിരയുക",
    filter: "ഫിൽട്ടർ ചെയ്യുക",
    sort: "സോർട്ട് ചെയ്യുക",
    view: "കാണുക",
    details: "വിശദാംശങ്ങൾ",
    more: "കൂടുതൽ",
    less: "കുറവ്"
  }
};
