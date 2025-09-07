import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Leaf, HardHat, Package } from 'lucide-react';

const mockFarmers = [
  { 
    id: 1, 
    farmer_name: 'Rajesh Kumar', 
    farm_size: '10 acres', 
    main_crops: 'Wheat, Rice', 
    farm_location: { city: 'Ludhiana', state: 'Punjab' }, 
    labour_needs: 'Harvesting help in April', 
    equipment_needs: 'Tractor rental',
    contact_email: 'rajesh@example.com',
    phone: '+91 98765 43210'
  },
  { 
    id: 2, 
    farmer_name: 'Suresh Patel', 
    farm_size: '5 acres', 
    main_crops: 'Cotton', 
    farm_location: { city: 'Ahmedabad', state: 'Gujarat' }, 
    labour_needs: 'Weeding assistance', 
    equipment_needs: 'Sprayer',
    contact_email: 'suresh@example.com',
    phone: '+91 98765 43211'
  },
  { 
    id: 3, 
    farmer_name: 'Meena Kumari', 
    farm_size: '15 acres', 
    main_crops: 'Sugarcane', 
    farm_location: { city: 'Meerut', state: 'Uttar Pradesh' }, 
    labour_needs: 'Planting crew for May', 
    equipment_needs: 'Harvester',
    contact_email: 'meena@example.com',
    phone: '+91 98765 43212'
  },
];

export default function FarmerPage() {
  const [farmers, setFarmers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // **BACKEND INTEGRATION POINT**
    // Replace with actual API call: GET /api/farmers
    setFarmers(mockFarmers);
    
    const fetchUser = () => {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
      } catch (e) {
        console.error("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const renderNeeds = (farmer) => {
    if (loading || !currentUser) return null;

    if (currentUser.user_role === 'labourer') {
      return (
        <div className="flex items-center text-sm text-red-600">
          <HardHat className="w-4 h-4 mr-2" />
          <span><b>Labour Needs:</b> {farmer.labour_needs}</span>
        </div>
      );
    }
    if (currentUser.user_role === 'retailer') {
      return (
        <div className="flex items-center text-sm text-blue-600">
          <Package className="w-4 h-4 mr-2" />
          <span><b>Equipment Needs:</b> {farmer.equipment_needs}</span>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Farmers Directory</h1>
      
      <Card className="dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input placeholder="Search farmers by name or location..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmers.map((farmer) => (
          <Card key={farmer.id} className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{farmer.farmer_name}</CardTitle>
              <Badge variant="secondary">{farmer.farm_size}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                {farmer.farm_location.city}, {farmer.farm_location.state}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Leaf className="w-4 h-4 mr-2" />
                <span>Crops: {farmer.main_crops}</span>
              </div>
              {renderNeeds(farmer)}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Email: {farmer.contact_email}</p>
                <p>Phone: {farmer.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}