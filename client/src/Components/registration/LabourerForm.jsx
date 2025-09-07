import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AddressFields from './AddressFields';

const formTranslations = {
  en: {
    labourerName: "Labourer Name",
    email: "Email",
    phone: "Phone",
    experience: "Years of Experience",
    dailyWage: "Daily Wage (₹)",
    skills: "Skills",
    availability: "Availability",
    currentLocation: "Current Location",
    enterName: "Enter labourer name",
    enterEmail: "Enter email address",
    enterPhone: "Enter phone number",
    enterExperience: "Enter years of experience",
    enterWage: "Enter daily wage",
    enterSkills: "Enter skills (comma separated)",
    enterAvailability: "Enter availability (e.g., Monday-Friday, 6AM-6PM)",
    required: "*"
  },
  hi: {
    labourerName: "मजदूर का नाम",
    email: "ईमेल",
    phone: "फोन",
    experience: "अनुभव के वर्ष",
    dailyWage: "दैनिक मजदूरी (₹)",
    skills: "कौशल",
    availability: "उपलब्धता",
    currentLocation: "वर्तमान स्थान",
    enterName: "मजदूर का नाम दर्ज करें",
    enterEmail: "ईमेल पता दर्ज करें",
    enterPhone: "फोन नंबर दर्ज करें",
    enterExperience: "अनुभव के वर्ष दर्ज करें",
    enterWage: "दैनिक मजदूरी दर्ज करें",
    enterSkills: "कौशल दर्ज करें (कॉमा से अलग)",
    enterAvailability: "उपलब्धता दर्ज करें (जैसे सोमवार-शुक्रवार, सुबह 6-शाम 6)",
    required: "*"
  },
  ml: {
    labourerName: "തൊഴിലാളിയുടെ പേര്",
    email: "ഇമെയിൽ",
    phone: "ഫോൺ",
    experience: "അനുഭവ വർഷങ്ങൾ",
    dailyWage: "ദൈനിക കൂലി (₹)",
    skills: "കഴിവുകൾ",
    availability: "ലഭ്യത",
    currentLocation: "നിലവിലെ സ്ഥാനം",
    enterName: "തൊഴിലാളിയുടെ പേര് നൽകുക",
    enterEmail: "ഇമെയിൽ വിലാസം നൽകുക",
    enterPhone: "ഫോൺ നമ്പർ നൽകുക",
    enterExperience: "അനുഭവ വർഷങ്ങൾ നൽകുക",
    enterWage: "ദൈനിക കൂലി നൽകുക",
    enterSkills: "കഴിവുകൾ നൽകുക (കോമ കൊണ്ട് വേർതിരിക്കുക)",
    enterAvailability: "ലഭ്യത നൽകുക (ഉദാ: തിങ്കൾ-വെള്ളി, രാവിലെ 6-വൈകുന്നേരം 6)",
    required: "*"
  }
};

export default function LabourerForm({ formData, onChange, language, translations }) {
  const t = formTranslations[language];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="labourer_name">{t.labourerName} {t.required}</Label>
          <Input
            id="labourer_name"
            value={formData.labourer_name || ''}
            onChange={(e) => onChange('labourer_name', e.target.value)}
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
          <Label htmlFor="work_experience">{t.experience}</Label>
          <Input
            id="work_experience"
            value={formData.work_experience || ''}
            onChange={(e) => onChange('work_experience', e.target.value)}
            placeholder={t.enterExperience}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="daily_wage">{t.dailyWage}</Label>
          <Input
            id="daily_wage"
            value={formData.daily_wage || ''}
            onChange={(e) => onChange('daily_wage', e.target.value)}
            placeholder={t.enterWage}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="skills">{t.skills}</Label>
          <Input
            id="skills"
            value={formData.skills || ''}
            onChange={(e) => onChange('skills', e.target.value)}
            placeholder={t.enterSkills}
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="availability">{t.availability}</Label>
          <Textarea
            id="availability"
            value={formData.availability || ''}
            onChange={(e) => onChange('availability', e.target.value)}
            placeholder={t.enterAvailability}
            className="mt-1 h-20"
          />
        </div>
      </div>

      <AddressFields
        address={formData.current_location}
        onChange={onChange}
        fieldPrefix="current_location"
        label={t.currentLocation}
        language={language}
      />
    </div>
  );
}