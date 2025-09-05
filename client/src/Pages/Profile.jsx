import React, { useState, useEffect } from "react";
import { User as UserIcon, Edit3, Save, MapPin, Phone, Calendar, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { CropEntry } from "@/entities/CropEntry";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    land_size: "",
    location: "",
    crops: []
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        phone_number: userData.phone_number || "",
        date_of_birth: userData.date_of_birth || "",
        gender: userData.gender || "",
        address: userData.address || "",
        land_size: userData.land_size?.toString() || "",
        location: userData.location || "",
        crops: userData.crops || []
      });
      
      // Load user's crop entries
      const userCrops = await CropEntry.filter({ farmer_id: userData.id });
      setCrops(userCrops);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCropsChange = (cropsString) => {
    const cropsArray = cropsString.split(',').map(crop => crop.trim()).filter(crop => crop);
    setFormData(prev => ({ ...prev, crops: cropsArray }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        ...formData,
        land_size: formData.land_size ? parseFloat(formData.land_size) : null
      };
      
      await User.updateMyUserData(updateData);
      setUser(prev => ({ ...prev, ...updateData }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user?.full_name || "Farmer Profile"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage your farming profile and crop information
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-green-600" />
                      Personal Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      disabled={saving}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={user?.full_name || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => handleInputChange('gender', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="land_size">Land Size (acres)</Label>
                      <Input
                        id="land_size"
                        type="number"
                        value={formData.land_size}
                        onChange={(e) => handleInputChange('land_size', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter land size"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full address"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crops">Crops Grown (comma-separated)</Label>
                    <Input
                      id="crops"
                      value={formData.crops.join(', ')}
                      onChange={(e) => handleCropsChange(e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Rice, Wheat, Cotton"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Stats & Summary */}
            <div className="space-y-6">
              {/* Profile Stats */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">User Type</p>
                      <Badge className="capitalize">
                        {user?.user_type || "farmer"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Land Size</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.land_size ? `${user.land_size} acres` : "Not specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crops Summary */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">My Crops</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.crops && user.crops.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.crops.map((crop, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No crops specified. Edit profile to add your crops.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    Add Crop Entry
                  </Button>
                  <Button className="w-full" variant="outline">
                    View Market Prices
                  </Button>
                  <Button className="w-full" variant="outline">
                    Check Weather
                  </Button>
                  <Button className="w-full gradient-green text-white hover:opacity-90">
                    Upload Produce
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}