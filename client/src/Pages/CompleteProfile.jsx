import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon, Briefcase, Tractor, HardHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/entities/User';

const roles = [
  { name: 'Farmer', icon: Tractor },
  { name: 'Retailer', icon: Briefcase },
  { name: 'Labourer', icon: HardHat },
  { name: 'Admin', icon: UserIcon },
];

export default function CompleteProfile() {
  const [selectedRole, setSelectedRole] = useState('Farmer');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        if (userData.user_type) {
          navigate(createPageUrl('Home'));
        }
        setUser(userData);
        setValue('email', userData.email, { shouldValidate: true });
        setValue('full_name', userData.full_name, { shouldValidate: true });
      } catch (error) {
        // Not logged in, redirect to home to trigger login
        navigate(createPageUrl('Home'));
      }
      setLoading(false);
    };
    loadUser();
  }, [navigate, setValue]);
  
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    reset(); // Reset form state, but keep user data
    setValue('email', user.email);
    setValue('full_name', user.full_name);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, user_type: selectedRole.toLowerCase() };
      await User.updateMyUserData(payload);
      alert('Profile completed successfully!');
      navigate(createPageUrl('Home'));
    } catch (error) {
      console.error("Profile update failed", error);
      alert('There was an error updating your profile. Please try again.');
    }
    setLoading(false);
  };

  const renderFormFields = () => {
    const isRetailer = selectedRole === 'Retailer';
    return (
      <motion.div
        key={selectedRole}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor={isRetailer ? "business_name" : "full_name"}>
            {isRetailer ? "Business Name" : "Full Name"}
          </Label>
          <Input 
            id={isRetailer ? "business_name" : "full_name"}
            {...register(isRetailer ? "business_name" : "full_name", { required: true })} 
            placeholder={isRetailer ? "Your Business Name" : "Your Full Name"}
            defaultValue={user?.full_name}
          />
          {errors[isRetailer ? "business_name" : "full_name"] && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              {...register("email", { required: true })} 
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              {...register("phone_number", { required: true })} 
              placeholder="Your Phone Number"
            />
            {errors.phone_number && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
        </div>
        
        <div className="space-y-2">
            <Label>{isRetailer ? "Business Address" : "Farm Location"}</Label>
            <div className="grid md:grid-cols-2 gap-4">
                 <Input {...register("address.street", { required: true })} placeholder="Street" />
                 <Input {...register("address.city", { required: true })} placeholder="City" />
                 <Input {...register("address.state", { required: true })} placeholder="State" />
                 <Input {...register("address.zip_code", { required: true })} placeholder="Zip Code" />
            </div>
             <Input {...register("address.country", { required: true })} placeholder="Country" className="mt-4" />
        </div>

        {isRetailer && (
          <>
            <div className="space-y-2">
              <Label htmlFor="business_type">Business Type</Label>
              <Select onValueChange={(value) => setValue('business_type', value)}>
                <SelectTrigger id="business_type">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supermarket">Supermarket</SelectItem>
                  <SelectItem value="grocery_store">Grocery Store</SelectItem>
                  <SelectItem value="online_store">Online Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input id="license_number" {...register("license_number", { required: true })} />
                {errors.license_number && <span className="text-red-500 text-sm">This field is required</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input id="tax_id" {...register("tax_id", { required: true })} />
                {errors.tax_id && <span className="text-red-500 text-sm">This field is required</span>}
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Just a few more details to get you started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 md:gap-4 mb-8">
            {roles.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant={selectedRole === name ? 'default' : 'outline'}
                onClick={() => handleRoleChange(name)}
                className={`flex-1 transition-all duration-300 ${selectedRole === name ? 'gradient-green text-white' : ''}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {name}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {renderFormFields()}
            </AnimatePresence>
            
            <Button type="submit" className="w-full gradient-green text-white hover:opacity-90 text-lg py-6" disabled={loading}>
              {loading ? 'Saving...' : `Complete Profile as ${selectedRole}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}