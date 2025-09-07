import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AddressFields from './AddressFields';

export default function FarmerForm({ formData, onChange, role }) {
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="farmer_name">{roleTitle} Name *</Label>
          <Input
            id="farmer_name"
            value={formData.farmer_name || ''}
            onChange={(e) => onChange('farmer_name', e.target.value)}
            placeholder={`Enter ${role} name`}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="contact_email">Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email || ''}
            onChange={(e) => onChange('contact_email', e.target.value)}
            placeholder="Enter email address"
            className="mt-1"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Enter phone number"
            className="mt-1"
            required
          />
        </div>
      </div>

      <AddressFields
        address={formData.farm_location}
        onChange={onChange}
        fieldPrefix="farm_location"
        label="Farm Location"
      />
    </div>
  );
}