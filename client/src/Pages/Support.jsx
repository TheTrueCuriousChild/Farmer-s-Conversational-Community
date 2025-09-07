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

export default function Support() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
        <p className="text-gray-600">Get help and find answers to your questions</p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Get immediate help from our experts</p>
            <p className="font-semibold text-green-600">1800-XXX-XXXX</p>
            <p className="text-sm text-gray-500">24/7 Available</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us detailed queries</p>
            <p className="font-semibold text-blue-600">support@krishiseva.com</p>
            <p className="text-sm text-gray-500">Response within 24 hours</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team</p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Start Chat
            </Button>
            <p className="text-sm text-gray-500 mt-2">9 AM - 6 PM IST</p>
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
          FAQ
        </Button>
        <Button
          variant={activeTab === "tickets" ? "default" : "ghost"}
          onClick={() => setActiveTab("tickets")}
          className="px-6"
        >
          My Tickets
        </Button>
        <Button
          variant={activeTab === "create" ? "default" : "ghost"}
          onClick={() => setActiveTab("create")}
          className="px-6"
        >
          Create Ticket
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
                  placeholder="Search frequently asked questions..."
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
              <CardTitle>My Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600">Ticket ID: {ticket.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Created: {ticket.created}</span>
                      <span>Last updated: {ticket.lastUpdate}</span>
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
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing</option>
                    <option value="feature">Feature Request</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea 
                    placeholder="Please describe your issue in detail..."
                    className="h-32"
                  />
                </div>

                <Button className="w-full">
                  Create Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}