import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Heart, MapPin, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunityMessage } from "@/entities/CommunityMessage";
import { User } from "@/entities/User";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Community() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [filterTopic, setFilterTopic] = useState("all");
  const [loading, setLoading] = useState(true);

  const topics = {
    general: { label: "General", color: "bg-blue-100 text-blue-800" },
    crop_advice: { label: "Crop Advice", color: "bg-green-100 text-green-800" },
    weather: { label: "Weather", color: "bg-cyan-100 text-cyan-800" },
    market_prices: { label: "Market Prices", color: "bg-orange-100 text-orange-800" },
    technology: { label: "Technology", color: "bg-purple-100 text-purple-800" },
    pest_control: { label: "Pest Control", color: "bg-red-100 text-red-800" }
  };

  useEffect(() => {
    loadUser();
    loadMessages();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadMessages = async () => {
    try {
      const messageData = await CommunityMessage.list('-created_date', 50);
      setMessages(messageData);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
    setLoading(false);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await CommunityMessage.create({
        message: newMessage,
        author_name: user.full_name,
        author_location: user.location || "Unknown",
        topic: selectedTopic
      });
      
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const filteredMessages = filterTopic === "all" 
    ? messages 
    : messages.filter(msg => msg.topic === filterTopic);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Farmer Community
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Connect, share experiences, and learn from fellow farmers
            </p>
          </div>

          {/* Post New Message */}
          {user && (
            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Share with Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-green-500 text-white">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.location || "Unknown Location"}</p>
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Share your farming experience, ask questions, or give advice..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  
                  <div className="flex justify-between items-center">
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(topics).map(([key, topic]) => (
                          <SelectItem key={key} value={key}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      type="submit" 
                      className="gradient-green text-white hover:opacity-90"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Filter Messages */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Community Messages ({filteredMessages.length})
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterTopic} onValueChange={setFilterTopic}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {Object.entries(topics).map(([key, topic]) => (
                    <SelectItem key={key} value={key}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading messages...</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-blue-500 text-white">
                              {getInitials(message.author_name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {message.author_name}
                              </h3>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span className="text-sm">{message.author_location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span className="text-sm">
                                  {format(new Date(message.created_date), "MMM d, HH:mm")}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <Badge className={topics[message.topic]?.color || "bg-gray-100 text-gray-800"}>
                                {topics[message.topic]?.label || message.topic}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                              {message.message}
                            </p>
                            
                            <div className="flex items-center gap-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                              >
                                <Heart className="w-4 h-4 mr-1" />
                                {message.likes_count || 0}
                              </Button>
                              <Button variant="ghost" size="sm">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {!loading && filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {filterTopic === "all" 
                    ? "No messages yet. Be the first to start a conversation!" 
                    : `No messages in ${topics[filterTopic]?.label} category`}
                </p>
                {!user && (
                  <Button 
                    className="mt-4 gradient-green text-white hover:opacity-90"
                    onClick={() => User.login()}
                  >
                    Login to Join Community
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}