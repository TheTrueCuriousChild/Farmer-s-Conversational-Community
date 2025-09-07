import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressFields from './AddressFields';

export default function RetailerForm({ formData, onChange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_name">Business Name *</Label>
          <Input
            id="business_name"
            value={formData.business_name || ''}
            onChange={(e) => onChange('business_name', e.target.value)}
            placeholder="Enter business name"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="contact_email">Contact Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email || ''}
            onChange={(e) => onChange('contact_email', e.target.value)}
            placeholder="Enter contact email"
            className="mt-1"
            required
          />
        </div>
        <div>
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
        <div>
          <Label htmlFor="business_type">Business Type *</Label>
          <Select
            value={formData.business_type || ''}
            onValueChange={(value) => onChange('business_type', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supermarket">Supermarket</SelectItem>
              <SelectItem value="grocery_store">Grocery Store</SelectItem>
              <SelectItem value="online_store">Online Store</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="license_number">License Number</Label>
          <Input
            id="license_number"
            value={formData.license_number || ''}
            onChange={(e) => onChange('license_number', e.target.value)}
            placeholder="Enter license number"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="tax_id">Tax ID</Label>
          <Input
            id="tax_id"
            value={formData.tax_id || ''}
            onChange={(e) => onChange('tax_id', e.target.value)}
            placeholder="Enter tax ID"
            className="mt-1"
          />
        </div>
      </div>

      <AddressFields
        address={formData.business_address}
        onChange={onChange}
        fieldPrefix="business_address"
        label="Business Address"
      />
    </div>
  );
}