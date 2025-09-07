import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddressFields({ address, onChange, fieldPrefix, label }) {
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
          <Label htmlFor={`${fieldPrefix}_street`}>Street Address</Label>
          <Input
            id={`${fieldPrefix}_street`}
            value={address?.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            placeholder="Enter street address"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_city`}>City</Label>
          <Input
            id={`${fieldPrefix}_city`}
            value={address?.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="Enter city"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_state`}>State</Label>
          <Input
            id={`${fieldPrefix}_state`}
            value={address?.state || ''}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            placeholder="Enter state"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_country`}>Country</Label>
          <Input
            id={`${fieldPrefix}_country`}
            value={address?.country || ''}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            placeholder="Enter country"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`${fieldPrefix}_zip`}>Zip Code</Label>
          <Input
            id={`${fieldPrefix}_zip`}
            value={address?.zip_code || ''}
            onChange={(e) => handleAddressChange('zip_code', e.target.value)}
            placeholder="Enter zip code"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}