import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  MapPin,
  Phone,
  User,
  Package
} from "lucide-react";

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState("buy");

  const products = [
    {
      id: 1,
      name: "Organic Wheat",
      price: 25,
      unit: "per kg",
      seller: "Ramesh Kumar",
      location: "Punjab",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
      category: "Grains",
      inStock: true
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: 40,
      unit: "per kg",
      seller: "Priya Sharma",
      location: "Maharashtra",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1546470427-227c46e8e6c3?w=300&h=200&fit=crop",
      category: "Vegetables",
      inStock: true
    },
    {
      id: 3,
      name: "Basmati Rice",
      price: 80,
      unit: "per kg",
      seller: "Amit Singh",
      location: "Haryana",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
      category: "Grains",
      inStock: true
    },
    {
      id: 4,
      name: "Organic Potatoes",
      price: 30,
      unit: "per kg",
      seller: "Sunita Devi",
      location: "Uttar Pradesh",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop",
      category: "Vegetables",
      inStock: false
    },
    {
      id: 5,
      name: "Fresh Onions",
      price: 20,
      unit: "per kg",
      seller: "Rajesh Patel",
      location: "Gujarat",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=300&h=200&fit=crop",
      category: "Vegetables",
      inStock: true
    },
    {
      id: 6,
      name: "Organic Lentils",
      price: 120,
      unit: "per kg",
      seller: "Meera Roy",
      location: "Rajasthan",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop",
      category: "Pulses",
      inStock: true
    }
  ];

  const categories = ["All", "Grains", "Vegetables", "Fruits", "Pulses", "Spices"];

  const myListings = [
    {
      id: 1,
      name: "Fresh Carrots",
      price: 35,
      unit: "per kg",
      views: 145,
      inquiries: 12,
      status: "active"
    },
    {
      id: 2,
      name: "Organic Spinach",
      price: 45,
      unit: "per kg",
      views: 89,
      inquiries: 6,
      status: "active"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-600">Buy and sell agricultural products directly with farmers</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "buy" ? "default" : "ghost"}
          onClick={() => setActiveTab("buy")}
          className="px-6"
        >
          Buy Products
        </Button>
        <Button
          variant={activeTab === "sell" ? "default" : "ghost"}
          onClick={() => setActiveTab("sell")}
          className="px-6"
        >
          My Listings
        </Button>
      </div>

      {activeTab === "buy" ? (
        <>
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Filter className="w-4 h-4 text-gray-500" />
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {!product.inStock && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-800">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{product.name}</span>
                    <span className="text-green-600 font-bold">₹{product.price} {product.unit}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      {product.seller}
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {product.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {product.location}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Sell Section */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">My Product Listings</h2>
            <Button>
              <Package className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {/* My Listings */}
          <div className="grid md:grid-cols-2 gap-6">
            {myListings.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{listing.name}</h3>
                      <p className="text-lg text-green-600 font-bold">₹{listing.price} {listing.unit}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {listing.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{listing.views}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{listing.inquiries}</div>
                      <div className="text-sm text-gray-600">Inquiries</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Edit Listing
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2</div>
                  <div className="text-gray-600">Active Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">234</div>
                  <div className="text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">18</div>
                  <div className="text-gray-600">Inquiries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">₹15,400</div>
                  <div className="text-gray-600">Revenue This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}