import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressFields from './AddressFields';

const formTranslations = {
  en: {
    businessName: "Business Name",
    contactEmail: "Contact Email",
    phone: "Phone",
    businessType: "Business Type",
    licenseNumber: "License Number",
    taxId: "Tax ID",
    businessAddress: "Business Address",
    enterBusinessName: "Enter business name",
    enterContactEmail: "Enter contact email",
    enterPhone: "Enter phone number",
    selectBusinessType: "Select business type",
    enterLicenseNumber: "Enter license number",
    enterTaxId: "Enter tax ID",
    supermarket: "Supermarket",
    groceryStore: "Grocery Store",
    onlineStore: "Online Store",
    required: "*"
  },
  hi: {
    businessName: "व्यापार का नाम",
    contactEmail: "संपर्क ईमेल",
    phone: "फोन",
    businessType: "व्यापार का प्रकार",
    licenseNumber: "लाइसेंस नंबर",
    taxId: "टैक्स आईडी",
    businessAddress: "व्यापारिक पता",
    enterBusinessName: "व्यापार का नाम दर्ज करें",
    enterContactEmail: "संपर्क ईमेल दर्ज करें",
    enterPhone: "फोन नंबर दर्ज करें",
    selectBusinessType: "व्यापार का प्रकार चुनें",
    enterLicenseNumber: "लाइसेंस नंबर दर्ज करें",
    enterTaxId: "टैक्स आईडी दर्ज करें",
    supermarket: "सुपरमार्केट",
    groceryStore: "किराना स्टोर",
    onlineStore: "ऑनलाइन स्टोर",
    required: "*"
  },
  ml: {
    businessName: "ബിസിനസ്സ് നാമം",
    contactEmail: "കോണ്ടാക്റ്റ് ഇമെയിൽ",
    phone: "ഫോൺ",
    businessType: "ബിസിനസ്സ് തരം",
    licenseNumber: "ലൈസൻസ് നമ്പർ",
    taxId: "ടാക്സ് ഐഡി",
    businessAddress: "ബിസിനസ്സ് വിലാസം",
    enterBusinessName: "ബിസിനസ്സ് നാമം നൽകുക",
    enterContactEmail: "കോണ്ടാക്റ്റ് ഇമെയിൽ നൽകുക",
    enterPhone: "ഫോൺ നമ്പർ നൽകുക",
    selectBusinessType: "ബിസിനസ്സ് തരം തിരഞ്ഞെടുക്കുക",
    enterLicenseNumber: "ലൈസൻസ് നമ്പർ നൽകുക",
    enterTaxId: "ടാക്സ് ഐഡി നൽകുക",
    supermarket: "സൂപ്പർമാർക്കറ്റ്",
    groceryStore: "പലചരക്ക് കട",
    onlineStore: "ഓൺലൈൻ സ്റ്റോർ",
    required: "*"
  }
};

export default function RetailerForm({ formData, onChange, language, translations }) {
  const t = formTranslations[language];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_name">{t.businessName} {t.required}</Label>
          <Input
            id="business_name"
            value={formData.business_name || ''}
            onChange={(e) => onChange('business_name', e.target.value)}
            placeholder={t.enterBusinessName}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="contact_email">{t.contactEmail} {t.required}</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email || ''}
            onChange={(e) => onChange('contact_email', e.target.value)}
            placeholder={t.enterContactEmail}
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
          <Label htmlFor="business_type">{t.businessType} {t.required}</Label>
          <Select
            value={formData.business_type || ''}
            onValueChange={(value) => onChange('business_type', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={t.selectBusinessType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supermarket">{t.supermarket}</SelectItem>
              <SelectItem value="grocery_store">{t.groceryStore}</SelectItem>
              <SelectItem value="online_store">{t.onlineStore}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="license_number">{t.licenseNumber}</Label>
          <Input
            id="license_number"
            value={formData.license_number || ''}
            onChange={(e) => onChange('license_number', e.target.value)}
            placeholder={t.enterLicenseNumber}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="tax_id">{t.taxId}</Label>
          <Input
            id="tax_id"
            value={formData.tax_id || ''}
            onChange={(e) => onChange('tax_id', e.target.value)}
            placeholder={t.enterTaxId}
            className="mt-1"
          />
        </div>
      </div>

      <AddressFields
        address={formData.business_address}
        onChange={onChange}
        fieldPrefix="business_address"
        label={t.businessAddress}
        language={language}
      />
    </div>
  );
}