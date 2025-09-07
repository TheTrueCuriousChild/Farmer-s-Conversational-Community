import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
} from "lucide-react";
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function Support() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("faq");

  const faqs = [
    {
      question: "How do I apply for government schemes?",
      answer: "You can apply for government schemes through our Government section. Select the scheme you're interested in, check your eligibility, and follow the application process.",
      category: "Government"
    },
    {
      question: "How accurate is the disease detection feature?",
      answer: "Our AI-powered disease detection has an accuracy rate of over 90%. However, we recommend consulting with agricultural experts for severe cases.",
      category: "Disease"
    },
    {
      question: "Can I sell my products directly through the marketplace?",
      answer: "Yes, you can create seller accounts and list your agricultural products. Buyers can contact you directly through the platform.",
      category: "Marketplace"
    },
    {
      question: "How do I get weather alerts for my location?",
      answer: "Weather alerts are automatically sent based on your registered location. You can update your location in the Profile section.",
      category: "Weather"
    },
    {
      question: "Are the farming courses free?",
      answer: "Most of our educational content is free. Some advanced courses may have a nominal fee, which will be clearly mentioned.",
      category: "Education"
    },
    {
      question: "How do I track my government scheme applications?",
      answer: "You can track all your applications in the Government section under 'My Applications'. Status updates are provided in real-time.",
      category: "Government"
    }
  ];

  const tickets = [
    {
      id: "TICK-2024-001",
      subject: "Issue with marketplace payment",
      status: "open",
      priority: "high",
      created: "2 days ago",
      lastUpdate: "1 day ago"
    },
    {
      id: "TICK-2024-002",
      subject: "Weather data not updating",
      status: "resolved",
      priority: "medium",
      created: "1 week ago",
      lastUpdate: "3 days ago"
    },
    {
      id: "TICK-2024-003",
      subject: "Unable to upload disease images",
      status: "in-progress",
      priority: "low",
      created: "5 days ago",
      lastUpdate: "2 days ago"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'open':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('supportCenter')}</h1>
        <p className="text-gray-600">{t('getHelpAndAnswers')}</p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t('phoneSupport')}</h3>
            <p className="text-gray-600 mb-4">{t('getImmediateHelp')}</p>
            <p className="font-semibold text-green-600">1800-XXX-XXXX</p>
            <p className="text-sm text-gray-500">{t('available24x7')}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t('emailSupport')}</h3>
            <p className="text-gray-600 mb-4">{t('sendDetailedQueries')}</p>
            <p className="font-semibold text-blue-600">support@krishiseva.com</p>
            <p className="text-sm text-gray-500">{t('responseWithin24h')}</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t('liveChat')}</h3>
            <p className="text-gray-600 mb-4">{t('chatWithSupportTeam')}</p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              {t('startChat')}
            </Button>
            <p className="text-sm text-gray-500 mt-2">{t('businessHours')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "faq" ? "default" : "ghost"}
          onClick={() => setActiveTab("faq")}
          className="px-6"
        >
          {t('faq')}
        </Button>
        <Button
          variant={activeTab === "tickets" ? "default" : "ghost"}
          onClick={() => setActiveTab("tickets")}
          className="px-6"
        >
          {t('myTickets')}
        </Button>
        <Button
          variant={activeTab === "create" ? "default" : "ghost"}
          onClick={() => setActiveTab("create")}
          className="px-6"
        >
          {t('createTicket')}
        </Button>
      </div>

      {activeTab === "faq" && (
        <>
          {/* FAQ Search */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('searchFaq')}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                    <Badge variant="outline">{faq.category}</Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === "tickets" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t('mySupportTickets')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600">{t('ticketId')}: {ticket.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status === 'resolved' ? t('resolved') : ticket.status === 'open' ? t('open') : ticket.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{t('created')}: {ticket.created}</span>
                      <span>{t('lastUpdated')}: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "create" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t('createSupportTicket')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('subject')}</label>
                  <Input placeholder={t('briefDescription')} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('category')}</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="">{t('selectCategory')}</option>
                    <option value="technical">{t('technicalIssue')}</option>
                    <option value="billing">{t('billing')}</option>
                    <option value="feature">{t('featureRequest')}</option>
                    <option value="general">{t('generalInquiry')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('priority')}</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="low">{t('low')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('description')}</label>
                  <Textarea 
                    placeholder={t('describeIssueDetail')}
                    className="h-32"
                  />
                </div>

                <Button className="w-full">
                  {t('createTicket')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
