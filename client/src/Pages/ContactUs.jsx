import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageCircle,
  Users,
  Building
} from "lucide-react";

export default function ContactUs() {
  const contactInfo = [
    {
      icon: Building,
      title: "Headquarters",
      details: "Krishi Seva Technologies Pvt. Ltd.",
      address: "Tech Park, Sector 62, Noida, UP 201301, India"
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: "+91 1800-XXX-XXXX (Toll Free)",
      address: "Available 24/7 for emergencies"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@krishiseva.com",
      address: "We respond within 24 hours"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Saturday: 9:00 AM - 6:00 PM",
      address: "Sunday: Emergency support only"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Rajesh Gupta",
      position: "Agricultural Expert",
      phone: "+91 98765-43210",
      email: "rajesh@krishiseva.com",
      speciality: "Crop Management & Disease Control"
    },
    {
      name: "Priya Sharma",
      position: "Technology Support Lead",
      phone: "+91 98765-43211",
      email: "priya@krishiseva.com",
      speciality: "App Support & Technical Issues"
    },
    {
      name: "Amit Kumar",
      position: "Market Specialist",
      phone: "+91 98765-43212",
      email: "amit@krishiseva.com",
      speciality: "Marketplace & Pricing"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-600">Get in touch with our team for support and inquiries</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="Your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Your last name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="your.email@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input type="tel" placeholder="+91 XXXXX XXXXX" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="What is your message about?" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us how we can help you..."
                  className="h-32"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-gray-700 mb-1">{info.details}</p>
                      <p className="text-sm text-gray-500">{info.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Office Location Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Find Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Interactive map coming soon</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">Krishi Seva Technologies Pvt. Ltd.</p>
                <p>Tech Park, Sector 62</p>
                <p>Noida, Uttar Pradesh 201301</p>
                <p>India</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Meet Our Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-6 border rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-2">{member.position}</p>
                <p className="text-sm text-gray-600 mb-4">{member.speciality}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Emergency Agricultural Support</h3>
              <p className="text-red-700 mb-2">For urgent farming emergencies and disasters</p>
              <p className="font-bold text-red-900">Emergency Hotline: 1800-XXX-EMERGENCY</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}