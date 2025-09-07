import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ShoppingCart, Package } from 'lucide-react';

const mockRetailers = [
{
  id: 1,
  business_name: 'Agri Supplies Co.',
  business_type: 'supermarket',
  business_address: { city: 'Pune', state: 'Maharashtra' },
  products: 'Fertilizers, Seeds, Tools',
  contact_email: 'contact@agrisupplies.com',
  phone: '+91 98765 54321'
},
{
  id: 2,
  business_name: 'Farm Equipment Store',
  business_type: 'grocery_store',
  business_address: { city: 'Bangalore', state: 'Karnataka' },
  products: 'Tractors, Harvesters, Irrigation',
  contact_email: 'sales@farmequip.com',
  phone: '+91 98765 54322'
},
{
  id: 3,
  business_name: 'Green Valley Mart',
  business_type: 'online_store',
  business_address: { city: 'Chennai', state: 'Tamil Nadu' },
  products: 'Organic Seeds, Pesticides',
  contact_email: 'info@greenvalley.com',
  phone: '+91 98765 54323'
}];


export default function RetailerPage() {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // **BACKEND INTEGRATION POINT**
    // Replace with actual API call: GET /api/retailers
    setRetailers(mockRetailers);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Retailers Directory</h1>
      
      <Card className="dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input placeholder="Search retailers by name or location..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailers.map((retailer) =>
        <Card key={retailer.id} className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{retailer.business_name}</CardTitle>
              <Badge variant="secondary" className="bg-green-400 text-slate-900 px-2.5 py-0.5 text-xs font-semibold capitalize inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80">
                {retailer.business_type.replace('_', ' ')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                {retailer.business_address.city}, {retailer.business_address.state}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Package className="w-4 h-4 mr-2" />
                <span>Products: {retailer.products}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Email: {retailer.contact_email}</p>
                <p>Phone: {retailer.phone}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>);

}