import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const formTranslations = {
  en: {
    adminName: "Admin Name",
    email: "Email",
    phone: "Phone",
    department: "Department",
    adminLevel: "Admin Level",
    responsibilities: "Responsibilities",
    enterName: "Enter admin name",
    enterEmail: "Enter email address",
    enterPhone: "Enter phone number",
    enterDepartment: "Enter department",
    enterAdminLevel: "Enter admin level (e.g., District, State, Regional)",
    enterResponsibilities: "Enter key responsibilities",
    required: "*"
  },
  hi: {
    adminName: "एडमिन का नाम",
    email: "ईमेल",
    phone: "फोन",
    department: "विभाग",
    adminLevel: "एडमिन स्तर",
    responsibilities: "जिम्मेदारियां",
    enterName: "एडमिन का नाम दर्ज करें",
    enterEmail: "ईमेल पता दर्ज करें",
    enterPhone: "फोन नंबर दर्ज करें",
    enterDepartment: "विभाग दर्ज करें",
    enterAdminLevel: "एडमिन स्तर दर्ज करें (जैसे जिला, राज्य, क्षेत्रीय)",
    enterResponsibilities: "मुख्य जिम्मेदारियां दर्ज करें",
    required: "*"
  },
  ml: {
    adminName: "അഡ്മിന്റെ പേര്",
    email: "ഇമെയിൽ",
    phone: "ഫോൺ",
    department: "ഡിപ്പാർട്ട്മെന്റ്",
    adminLevel: "അഡ്മിൻ ലെവൽ",
    responsibilities: "ഉത്തരവാദിത്തങ്ങൾ",
    enterName: "അഡ്മിന്റെ പേര് നൽകുക",
    enterEmail: "ഇമെയിൽ വിലാസം നൽകുക",
    enterPhone: "ഫോൺ നമ്പർ നൽകുക",
    enterDepartment: "ഡിപ്പാർട്ട്മെന്റ് നൽകുക",
    enterAdminLevel: "അഡ്മിൻ ലെവൽ നൽകുക (ഉദാ: ജില്ല, സംസ്ഥാനം, പ്രാദേശികം)",
    enterResponsibilities: "പ്രധാന ഉത്തരവാദിത്തങ്ങൾ നൽകുക",
    required: "*"
  }
};

export default function AdminForm({ formData, onChange, language, translations }) {
  const t = formTranslations[language];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="admin_name">{t.adminName} {t.required}</Label>
          <Input
            id="admin_name"
            value={formData.admin_name || ''}
            onChange={(e) => onChange('admin_name', e.target.value)}
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
          <Label htmlFor="department">{t.department}</Label>
          <Input
            id="department"
            value={formData.department || ''}
            onChange={(e) => onChange('department', e.target.value)}
            placeholder={t.enterDepartment}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="admin_level">{t.adminLevel}</Label>
          <Input
            id="admin_level"
            value={formData.admin_level || ''}
            onChange={(e) => onChange('admin_level', e.target.value)}
            placeholder={t.enterAdminLevel}
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="responsibilities">{t.responsibilities}</Label>
          <Textarea
            id="responsibilities"
            value={formData.responsibilities || ''}
            onChange={(e) => onChange('responsibilities', e.target.value)}
            placeholder={t.enterResponsibilities}
            className="mt-1 h-24"
          />
        </div>
      </div>
    </div>
  );
}