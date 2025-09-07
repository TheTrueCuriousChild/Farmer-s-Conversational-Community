import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const addressTranslations = {
  en: {
    streetAddress: "Street Address",
    city: "City",
    state: "State",
    country: "Country",
    zipCode: "Zip Code",
    enterStreet: "Enter street address",
    enterCity: "Enter city",
    enterState: "Enter state",
    enterCountry: "Enter country",
    enterZip: "Enter zip code"
  },
  hi: {
    streetAddress: "सड़क का पता",
    city: "शहर",
    state: "राज्य",
    country: "देश",
    zipCode: "पिन कोड",
    enterStreet: "सड़क का पता दर्ज करें",
    enterCity: "शहर दर्ज करें",
    enterState: "राज्य दर्ज करें",
    enterCountry: "देश दर्ज करें",
    enterZip: "पिन कोड दर्ज करें"
  },
  ml: {
    streetAddress: "തെരുവ് വിലാസം",
    city: "നഗരം",
    state: "സംസ്ഥാനം",
    country: "രാജ്യം",
    zipCode: "പിൻ കോഡ്",
    enterStreet: "തെരുവ് വിലാസം നൽകുക",
    enterCity: "നഗരം നൽകുക",
    enterState: "സംസ്ഥാനം നൽകുക",
    enterCountry: "രാജ്യം നൽകുക",
    enterZip: "പിൻ കോഡ് നൽകുക"
  }
};

export default function AddressFields({ address, onChange, fieldPrefix, label, language = 'en' }) {
  const t = addressTranslations[language];

  const handleAddressChange = (field, value) => {
    onChange(fieldPrefix, {
      ...address,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor={`${fieldPrefix}_street`}>{t.streetAddress}</Label>
          <Input
            id={`${fieldPrefix}_street`}
            value={address?.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            placeholder={t.enterStreet}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_city`}>{t.city}</Label>
          <Input
            id={`${fieldPrefix}_city`}
            value={address?.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder={t.enterCity}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_state`}>{t.state}</Label>
          <Input
            id={`${fieldPrefix}_state`}
            value={address?.state || ''}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            placeholder={t.enterState}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_country`}>{t.country}</Label>
          <Input
            id={`${fieldPrefix}_country`}
            value={address?.country || ''}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            placeholder={t.enterCountry}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_zip`}>{t.zipCode}</Label>
          <Input
            id={`${fieldPrefix}_zip`}
            value={address?.zip_code || ''}
            onChange={(e) => handleAddressChange('zip_code', e.target.value)}
            placeholder={t.enterZip}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}