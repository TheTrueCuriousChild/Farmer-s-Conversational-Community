import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AddressFields from './AddressFields';

const formTranslations = {
  en: {
    farmerName: "Farmer Name",
    email: "Email",
    phone: "Phone",
    farmSize: "Farm Size (acres)",
    mainCrops: "Main Crops",
    farmingExperience: "Years of Experience",
    farmLocation: "Farm Location",
    enterName: "Enter farmer name",
    enterEmail: "Enter email address",
    enterPhone: "Enter phone number",
    enterFarmSize: "Enter farm size",
    enterCrops: "Enter main crops (comma separated)",
    enterExperience: "Enter years of farming experience",
    required: "*"
  },
  hi: {
    farmerName: "किसान का नाम",
    email: "ईमेल",
    phone: "फोन",
    farmSize: "खेत का आकार (एकड़)",
    mainCrops: "मुख्य फसलें",
    farmingExperience: "अनुभव के वर्ष",
    farmLocation: "खेत का स्थान",
    enterName: "किसान का नाम दर्ज करें",
    enterEmail: "ईमेल पता दर्ज करें",
    enterPhone: "फोन नंबर दर्ज करें",
    enterFarmSize: "खेत का आकार दर्ज करें",
    enterCrops: "मुख्य फसलें दर्ज करें (कॉमा से अलग)",
    enterExperience: "खेती के अनुभव के वर्ष दर्ज करें",
    required: "*"
  },
  ml: {
    farmerName: "കർഷകന്റെ പേര്",
    email: "ഇമെയിൽ",
    phone: "ഫോൺ",
    farmSize: "കൃഷിഭൂമിയുടെ വലുപ്പം (ഏക്കർ)",
    mainCrops: "പ്രധാന വിളകൾ",
    farmingExperience: "അനുഭവ വർഷങ്ങൾ",
    farmLocation: "കൃഷിഭൂമിയുടെ സ്ഥാനം",
    enterName: "കർഷകന്റെ പേര് നൽകുക",
    enterEmail: "ഇമെയിൽ വിലാസം നൽകുക",
    enterPhone: "ഫോൺ നമ്പർ നൽകുക",
    enterFarmSize: "കൃഷിഭൂമിയുടെ വലുപ്പം നൽകുക",
    enterCrops: "പ്രധാന വിളകൾ നൽകുക (കോമ കൊണ്ട് വേർതിരിക്കുക)",
    enterExperience: "കൃഷിയിലെ അനുഭവ വർഷങ്ങൾ നൽകുക",
    required: "*"
  }
};

export default function FarmerForm({ formData, onChange, role, language, translations }) {
  const t = formTranslations[language];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="farmer_name">{t.farmerName} {t.required}</Label>
          <Input
            id="farmer_name"
            value={formData.farmer_name || ''}
            onChange={(e) => onChange('farmer_name', e.target.value)}
            placeholder={t.enterName}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="contact_email">{t.email} {t.required}</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email || ''}
            onChange={(e) => onChange('contact_email', e.target.value)}
            placeholder={t.enterEmail}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">{t.phone} {t.required}</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder={t.enterPhone}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="farm_size">{t.farmSize}</Label>
          <Input
            id="farm_size"
            value={formData.farm_size || ''}
            onChange={(e) => onChange('farm_size', e.target.value)}
            placeholder={t.enterFarmSize}
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="main_crops">{t.mainCrops}</Label>
          <Input
            id="main_crops"
            value={formData.main_crops || ''}
            onChange={(e) => onChange('main_crops', e.target.value)}
            placeholder={t.enterCrops}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="farming_experience">{t.farmingExperience}</Label>
          <Input
            id="farming_experience"
            value={formData.farming_experience || ''}
            onChange={(e) => onChange('farming_experience', e.target.value)}
            placeholder={t.enterExperience}
            className="mt-1"
          />
        </div>
      </div>

      <AddressFields
        address={formData.farm_location}
        onChange={onChange}
        fieldPrefix="farm_location"
        label={t.farmLocation}
        language={language}
      />
    </div>
  );
}