import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  FileText, 
  Calendar, 
  IndianRupee,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function Government() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const schemes = [
    {
      id: 1,
      name: "PM-KISAN",
      description: "Income support scheme providing ₹6,000 per year to all farmer families",
      category: "subsidy",
      amount: "₹6,000/year",
      eligibility: "All farmer families with cultivable land",
      status: "active",
      deadline: "Ongoing",
      benefits: ["Direct cash transfer", "No paperwork required", "Automatic enrollment"]
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme providing financial support in case of crop loss",
      category: "insurance",
      amount: "Up to ₹2 lakh coverage",
      eligibility: "All farmers growing notified crops",
      status: "active",
      deadline: "Before sowing season",
      benefits: ["Premium subsidy", "Quick claim settlement", "Coverage for all risks"]
    },
    {
      id: 3,
      name: "Soil Health Card Scheme",
      description: "Free soil testing and health cards for farmers",
      category: "support",
      amount: "Free",
      eligibility: "All farmers",
      status: "active",
      deadline: "Ongoing",
      benefits: ["Free soil testing", "Nutrient recommendations", "Digital access"]
    },
    {
      id: 4,
      name: "Kisan Credit Card",
      description: "Easy credit facility for agriculture and allied activities",
      category: "credit",
      amount: "Based on crop area",
      eligibility: "Land-owning farmers",
      status: "active",
      deadline: "Ongoing",
      benefits: ["Low interest rates", "Flexible repayment", "Insurance coverage"]
    },
    {
      id: 5,
      name: "National Agriculture Market",
      description: "Online trading platform for agricultural commodities",
      category: "market",
      amount: "Commission-based",
      eligibility: "All farmers and traders",
      status: "active",
      deadline: "Ongoing",
      benefits: ["Better price discovery", "Transparent bidding", "Online payment"]
    },
    {
      id: 6,
      name: "Organic Farming Scheme",
      description: "Promotion of organic farming with financial assistance",
      category: "subsidy",
      amount: "Up to ₹50,000/ha",
      eligibility: "Farmers adopting organic practices",
      status: "limited",
      deadline: "March 31, 2024",
      benefits: ["Input subsidy", "Certification support", "Market linkage"]
    }
  ];

  const applications = [
    {
      scheme: "PM-KISAN",
      applicationId: "PMK2024001234",
      status: "approved",
      submittedDate: "15 Jan 2024",
      amount: "₹2,000"
    },
    {
      scheme: "Crop Insurance",
      applicationId: "CI2024005678",
      status: "pending",
      submittedDate: "20 Jan 2024",
      amount: "₹1,500"
    },
    {
      scheme: "Soil Health Card",
      applicationId: "SHC2024009012",
      status: "processing",
      submittedDate: "10 Jan 2024",
      amount: "Free"
    }
  ];

  const categories = [
    { id: "all", name: t('allSchemes') },
    { id: "subsidy", name: t('subsidies') },
    { id: "insurance", name: t('insurance') },
    { id: "credit", name: t('credit') },
    { id: "support", name: "Support" },
    { id: "market", name: t('marketSupport') }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'subsidy':
        return 'bg-green-100 text-green-800';
      case 'insurance':
        return 'bg-blue-100 text-blue-800';
      case 'credit':
        return 'bg-purple-100 text-purple-800';
      case 'support':
        return 'bg-orange-100 text-orange-800';
      case 'market':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSchemes = activeCategory === "all" 
    ? schemes 
    : schemes.filter(scheme => scheme.category === activeCategory);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('governmentSchemesTitle')}</h1>
        <p className="text-gray-600">{t('accessGovernmentPrograms')}</p>
      </div>

      {/* My Applications Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('myApplications')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((app, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(app.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.scheme}</h3>
                    <p className="text-sm text-gray-600">{t('applicationId')}: {app.applicationId}</p>
                    <p className="text-sm text-gray-500">{t('submitted')}: {app.submittedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(app.status)}>
                    {app.status === 'approved' ? t('approved') : 
                     app.status === 'processing' ? t('processing') : 
                     app.status}
                  </Badge>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{app.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{scheme.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getCategoryColor(scheme.category)}>
                    {scheme.category}
                  </Badge>
                  {scheme.status === 'limited' && (
                    <Badge variant="destructive">{t('limitedTime')}</Badge>
                  )}
                </div>
              </div>
              <p className="text-gray-600">{scheme.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {t('amount')}
                  </div>
                  <div className="font-semibold text-green-600">{scheme.amount}</div>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {t('deadline')}
                  </div>
                  <div className="font-semibold">{scheme.deadline}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('eligibility')}:</h4>
                <p className="text-sm text-gray-600">{scheme.eligibility}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('keyBenefits')}:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {scheme.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  {t('applyNow')}
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {t('quickLinks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Ministry of Agriculture",
              "DBT Agriculture Portal",
              "PM-Kisan Portal",
              "Kisan Call Center"
            ].map((link, index) => (
              <Button key={index} variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Building2 className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{link}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
