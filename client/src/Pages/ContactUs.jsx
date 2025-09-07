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
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function ContactUs() {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: Building,
      title: t('headquarters'),
      details: "Krishi Seva Technologies Pvt. Ltd.",
      address: "Tech Park, Sector 62, Noida, UP 201301, India"
    },
    {
      icon: Phone,
      title: t('phoneSupportContact'),
      details: "+91 1800-XXX-XXXX (Toll Free)",
      address: t('available24x7')
    },
    {
      icon: Mail,
      title: t('emailSupportContact'),
      details: "support@krishiseva.com",
      address: t('responseWithin24h')
    },
    {
      icon: Clock,
      title: t('businessHoursContact'),
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('contactUsTitle')}</h1>
        <p className="text-gray-600">{t('getInTouchWithTeam')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {t('sendMessage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('firstName')}</label>
                  <Input placeholder={t('yourFirstName')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('lastName')}</label>
                  <Input placeholder={t('yourLastName')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('email')}</label>
                <Input type="email" placeholder={t('yourEmail')} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('phone')}</label>
                <Input type="tel" placeholder={t('phoneNumber')} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('subject')}</label>
                <Input placeholder={t('messageSubject')} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder={t('messageText')}
                  className="h-32"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                {t('sendMessageBtn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInformation')}</CardTitle>
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
                {t('findUs')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>{t('interactiveMapComingSoon')}</p>
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
            {t('meetOurTeam')}
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
              <h3 className="font-semibold text-red-900 mb-1">{t('emergencySupport')}</h3>
              <p className="text-red-700 mb-2">{t('urgentFarmingEmergencies')}</p>
              <p className="font-bold text-red-900">{t('emergencyHotline')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
