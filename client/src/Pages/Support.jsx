import React, { useState, useEffect, useCallback } from "react";
import { HelpCircle, Send, MessageSquare, Phone, Mail, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Query } from "@/entities/Query";
import { User } from "@/entities/User";
import { format } from "date-fns";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I use the disease checker?",
    answer: "Upload a clear photo of your crop showing the affected area. Our AI will analyze the image and provide diagnosis with treatment recommendations.",
    category: "technical_support"
  },
  {
    question: "What government schemes am I eligible for?",
    answer: "Visit our Government Schemes page to see all available programs. Filter by your farmer type and location to find relevant schemes.",
    category: "government_schemes"
  },
  {
    question: "How accurate is the weather forecast?",
    answer: "Our weather data is sourced from meteorological departments and updated every 6 hours. Accuracy is typically 85-90% for next 7 days.",
    category: "weather_help"
  },
  {
    question: "Can I sell my produce directly to retailers?",
    answer: "Yes! Use our Marketplace section to list your produce. Retailers can view and contact you directly for purchases.",
    category: "market_info"
  },
  {
    question: "How do I track my crop growth?",
    answer: "Go to your Profile dashboard and add crop entries. You can log watering, fertilizing, and growth stages with reminders.",
    category: "general"
  }
];

export default function Support() {
  const [user, setUser] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuery, setNewQuery] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewQuery, setShowNewQuery] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  const loadQueries = useCallback(async (userData) => {
    if (userData) {
      try {
        const userQueries = await Query.filter({ user_id: userData.id }, '-created_date');
        setQueries(userQueries);
      } catch (error) {
        console.error("Error loading queries:", error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const userData = await loadUser();
      await loadQueries(userData);
    };
    loadData();
  }, [loadUser, loadQueries]);

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!user) {
      User.login();
      return;
    }

    setSubmitting(true);
    try {
      await Query.create({
        ...newQuery,
        user_id: user.id
      });
      
      setNewQuery({
        subject: "",
        description: "",
        category: "general", 
        priority: "medium"
      });
      setShowNewQuery(false);
      await loadQueries(user);
    } catch (error) {
      console.error("Error submitting query:", error);
    }
    setSubmitting(false);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Help & Support
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Get help with KrishiSeva features or submit queries to our support team
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <div className="text-lg font-bold">Live Chat</div>
                <div className="text-green-100 text-sm">Available 24/7</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 mx-auto mb-2" />
                <div className="text-lg font-bold">Call Support</div>
                <div className="text-blue-100 text-sm">+91 9876543210</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-2" />
                <div className="text-lg font-bold">Email Us</div>
                <div className="text-purple-100 text-sm">support@krishiseva.com</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Query Section */}
            <div className="space-y-6">
              {/* Submit New Query */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Submit Query</CardTitle>
                    <Button
                      onClick={() => setShowNewQuery(!showNewQuery)}
                      className="gradient-green text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Query
                    </Button>
                  </div>
                </CardHeader>
                {showNewQuery && (
                  <CardContent>
                    <form onSubmit={handleSubmitQuery} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={newQuery.subject}
                          onChange={(e) => setNewQuery({...newQuery, subject: e.target.value})}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            value={newQuery.category} 
                            onValueChange={(value) => setNewQuery({...newQuery, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical_support">Technical Support</SelectItem>
                              <SelectItem value="crop_disease">Crop Disease</SelectItem>
                              <SelectItem value="weather_help">Weather Help</SelectItem>
                              <SelectItem value="market_info">Market Info</SelectItem>
                              <SelectItem value="government_schemes">Government Schemes</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select 
                            value={newQuery.priority} 
                            onValueChange={(value) => setNewQuery({...newQuery, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newQuery.description}
                          onChange={(e) => setNewQuery({...newQuery, description: e.target.value})}
                          placeholder="Detailed description of your query"
                          rows={4}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full gradient-green text-white"
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Query"}
                      </Button>
                    </form>
                  </CardContent>
                )}
              </Card>

              {/* My Queries */}
              {user && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>My Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600 dark:text-gray-300">Loading queries...</p>
                      </div>
                    ) : queries.length > 0 ? (
                      <div className="space-y-4">
                        {queries.slice(0, 5).map((query, index) => (
                          <div key={query.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {query.subject}
                              </h4>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(query.status)}>
                                  {query.status}
                                </Badge>
                                <Badge className={getPriorityColor(query.priority)}>
                                  {query.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {query.description}
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(query.created_date), "MMM d, yyyy 'at' HH:mm")}
                            </div>
                            {query.response && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                                  Support Response:
                                </div>
                                <div className="text-sm text-blue-800 dark:text-blue-400">
                                  {query.response}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No queries submitted yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}