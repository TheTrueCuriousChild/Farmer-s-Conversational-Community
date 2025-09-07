
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import RoleSelector from '../components/registration/RoleSelector';
import FarmerForm from '../components/registration/FarmerForm';
import RetailerForm from '../components/registration/RetailerForm';
import LabourerForm from '../components/registration/LabourerForm';
import AdminForm from '../components/registration/AdminForm';

const translations = {
  en: {
    title: "Create Your Profile",
    subtitle: "Tell us about yourself to personalize your Krishi Seva experience",
    profileSetup: "Profile Setup",
    saveProfile: "Save Profile",
    savingProfile: "Saving Profile...",
    successMessage: "Profile created successfully! Redirecting to your dashboard...",
    errorMessage: "There was an error creating your profile. Please try again.",
    emailRequired: "Email is required",
    invalidEmail: "Please enter a valid email address",
    phoneRequired: "Phone number is required",
    businessNameRequired: "Business name is required",
    businessTypeRequired: "Business type is required",
    nameRequired: "Name is required",
    selectLanguage: "Select Language"
  },
  hi: {
    title: "अपनी प्रोफ़ाइल बनाएं",
    subtitle: "कृषि सेवा अनुभव को व्यक्तिगत बनाने के लिए हमें अपने बारे में बताएं",
    profileSetup: "प्रोफ़ाइल सेटअप",
    saveProfile: "प्रोफ़ाइल सहेजें",
    savingProfile: "प्रोफ़ाइल सहेजी जा रही है...",
    successMessage: "प्रोफ़ाइल सफलतापूर्वक बनाई गई! आपके डैशबोर्ड पर भेजा जा रहा है...",
    errorMessage: "आपकी प्रोफ़ाइल बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    emailRequired: "ईमेल आवश्यक है",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
    phoneRequired: "फोन नंबर आवश्यक है",
    businessNameRequired: "व्यापार का नाम आवश्यक है",
    businessTypeRequired: "व्यापार का प्रकार आवश्यक है",
    nameRequired: "नाम आवश्यक है",
    selectLanguage: "भाषा चुनें"
  },
  ml: {
    title: "നിങ്ങളുടെ പ്രൊഫൈൽ സൃഷ്ടിക്കുക",
    subtitle: "കൃഷി സേവ അനുഭവം വ്യക്തിഗതമാക്കാൻ നിങ്ങളെക്കുറിച്ച് പറയുക",
    profileSetup: "പ്രൊഫൈൽ സെറ്റപ്പ്",
    saveProfile: "പ്രൊഫൈൽ സേവ് ചെയ്യുക",
    savingProfile: "പ്രൊഫൈൽ സേവ് ചെയ്യുന്നു...",
    successMessage: "പ്രൊഫൈൽ വിജയകരമായി സൃഷ്ടിച്ചു! നിങ്ങളുടെ ഡാഷ്ബോർഡിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു...",
    errorMessage: "നിങ്ങളുടെ പ്രൊഫൈൽ സൃഷ്ടിക്കുന്നതിൽ പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    emailRequired: "ഇമെയിൽ ആവശ്യമാണ്",
    invalidEmail: "ദയവായി സാധുവായ ഇമെയിൽ വിലാസം നൽകുക",
    phoneRequired: "ഫോൺ നമ്പർ ആവശ്യമാണ്",
    businessNameRequired: "ബിസിനസ്സ് നാമം ആവശ്യമാണ്",
    businessTypeRequired: "ബിസിനസ്സ് തരം ആവശ്യമാണ്",
    nameRequired: "നാമം ആവശ്യമാണ്",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക"
  }
};

export default function Registration() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [language, setLanguage] = useState('en');

  const t = translations[language];

  useEffect(() => {
    // Check if user is already registered
    const existingUser = localStorage.getItem('currentUser');
    if (existingUser) {
      window.location.href = createPageUrl('Home');
    }
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.contact_email) {
      errors.push(t.emailRequired);
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      errors.push(t.invalidEmail);
    }

    if (!formData.phone) {
      errors.push(t.phoneRequired);
    }

    if (selectedRole === 'retailer') {
      if (!formData.business_name) errors.push(t.businessNameRequired);
      if (!formData.business_type) errors.push(t.businessTypeRequired);
    } else if (selectedRole === 'farmer') {
      if (!formData.farmer_name) errors.push(t.nameRequired);
    } else if (selectedRole === 'labourer') {
      if (!formData.labourer_name) errors.push(t.nameRequired);
    } else if (selectedRole === 'admin') {
      if (!formData.admin_name) errors.push(t.nameRequired);
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      setValidationErrors(["Please select a role."]);
      return;
    }
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Create user data object
      const userData = {
        id: Date.now(), // Simple ID generation
        ...formData,
        user_role: selectedRole,
        preferred_language: language,
        created_date: new Date().toISOString(),
        email: formData.contact_email,
        full_name: formData.farmer_name || formData.business_name || formData.labourer_name || formData.admin_name
      };

      // Store user data in localStorage (for demo purposes)
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        window.location.href = createPageUrl('Home');
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    if (!selectedRole) return null;

    const formProps = {
      formData,
      onChange: handleFormChange,
      language,
      translations: translations[language]
    };

    switch (selectedRole) {
      case 'retailer':
        return <RetailerForm {...formProps} />;
      case 'farmer':
        return <FarmerForm {...formProps} role={selectedRole} />;
      case 'labourer':
        return <LabourerForm {...formProps} />;
      case 'admin':
        return <AdminForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-xl text-gray-600 mt-4">
                  {t.subtitle}
                </p>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-600" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="ml">മലയാളം</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-800">
                {t.profileSetup}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <RoleSelector
                selectedRole={selectedRole}
                onRoleSelect={setSelectedRole}
                language={language}
                translations={translations[language]}
              />

              <AnimatePresence mode="wait">
                {selectedRole && (
                  <motion.div
                    key={selectedRole}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-gray-50/50 border border-gray-200">
                      <CardContent className="p-6">
                        {renderForm()}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {validationErrors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        {validationErrors.map((error, index) => (
                          <div key={index}>• {error}</div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Alert variant={submitStatus === 'success' ? 'default' : 'destructive'}>
                    {submitStatus === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription className={submitStatus === 'success' ? 'text-green-800' : ''}>
                      {submitStatus === 'success' ? t.successMessage : t.errorMessage}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {selectedRole && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center"
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t.savingProfile}
                      </>
                    ) : (
                      t.saveProfile
                    )}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <footer className="w-full text-center py-4 mt-10 bg-gray-100 bg-opacity-70 text-gray-600 text-sm">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} Krishi Seva. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
