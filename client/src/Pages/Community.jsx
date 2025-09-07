import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { 
  Send, 
  Heart, 
  MessageCircle, 
  Share2, 
  Users,
  Leaf,
  ShoppingCart,
  HardHat,
  Briefcase,
  Plus
} from 'lucide-react';

const translations = {
  en: {
    title: "Community Forum",
    subtitle: "Connect with fellow farmers, share knowledge, and grow together",
    createPost: "Create Post",
    writePost: "What's on your mind?",
    shareThoughts: "Share your farming experiences, ask questions, or help others...",
    post: "Post",
    likes: "likes",
    comments: "comments",
    reply: "Reply",
    allPosts: "All Posts",
    myPosts: "My Posts",
    trending: "Trending",
    categories: "Categories",
    general: "General",
    cropAdvice: "Crop Advice", 
    marketplace: "Marketplace",
    weather: "Weather",
    technology: "Technology"
  },
  hi: {
    title: "सामुदायिक मंच",
    subtitle: "साथी किसानों से जुड़ें, ज्ञान साझा करें, और एक साथ बढ़ें",
    createPost: "पोस्ट बनाएं",
    writePost: "आपके मन में क्या है?",
    shareThoughts: "अपने खेती के अनुभव साझा करें, प्रश्न पूछें, या दूसरों की मदद करें...",
    post: "पोस्ट करें",
    likes: "लाइक्स",
    comments: "टिप्पणियाँ",
    reply: "उत्तर दें",
    allPosts: "सभी पोस्ट",
    myPosts: "मेरी पोस्ट",
    trending: "चर्चित",
    categories: "श्रेणियां",
    general: "सामान्य",
    cropAdvice: "फसल सलाह",
    marketplace: "बाजार",
    weather: "मौसम",
    technology: "तकनीक"
  },
  ml: {
    title: "കമ്മ്യൂണിറ്റി ഫോറം",
    subtitle: "സഹ കർഷകരുമായി ബന്ധപ്പെടുക, അറിവ് പങ്കിടുക, ഒരുമിച്ച് വളരുക",
    createPost: "പോസ്റ്റ് സൃഷ്ടിക്കുക",
    writePost: "നിങ്ങളുടെ മനസ്സിൽ എന്താണ്?",
    shareThoughts: "നിങ്ങളുടെ കാർഷിക അനുഭവങ്ങൾ പങ്കിടുക, ചോദ്യങ്ങൾ ചോദിക്കുക, അല്ലെങ്കിൽ മറ്റുള്ളവരെ സഹായിക്കുക...",
    post: "പോസ്റ്റ് ചെയ്യുക",
    likes: "ലൈക്കുകൾ",
    comments: "കമന്റുകൾ",
    reply: "മറുപടി",
    allPosts: "എല്ലാ പോസ്റ്റുകളും",
    myPosts: "എന്റെ പോസ്റ്റുകൾ",
    trending: "ട്രെൻഡിംഗ്",
    categories: "വിഭാഗങ്ങൾ",
    general: "സാധാരണ",
    cropAdvice: "വിള ഉപദേശം",
    marketplace: "മാർക്കറ്റ്പ്ലേസ്",
    weather: "കാലാവസ്ഥ",
    technology: "സാങ്കേതികവിദ്യ"
  }
};

const mockPosts = [
  {
    id: 1,
    author: "Rajesh Kumar",
    role: "farmer", 
    content: "Just harvested my wheat crop! Got 45 quintals from 10 acres. The new variety seeds really made a difference. Happy to share my experience with anyone interested.",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    category: "general"
  },
  {
    id: 2,
    author: "Priya Agro Supplies",
    role: "retailer",
    content: "New stock of organic fertilizers available! Special discount for bulk orders. DM for prices and delivery options.",
    timestamp: "4 hours ago", 
    likes: 12,
    comments: 5,
    category: "marketplace"
  },
  {
    id: 3,
    author: "Suresh Mali",
    role: "labourer",
    content: "Looking for harvesting work in Maharashtra region. Experienced team of 10 people available. Can start immediately.",
    timestamp: "6 hours ago",
    likes: 8,
    comments: 3,
    category: "general"
  }
];

export default function Community({ language = 'en', translations: pageTranslations }) {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [activeCategory, setActiveCategory] = useState('allPosts');
  
  const t = translations[language];

  const getRoleIcon = (role) => {
    switch(role) {
      case 'farmer': return <Leaf className="w-4 h-4 text-green-600" />;
      case 'retailer': return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'labourer': return <HardHat className="w-4 h-4 text-orange-600" />;
      case 'admin': return <Briefcase className="w-4 h-4 text-purple-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'farmer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'retailer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'labourer': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: "You",
        role: "farmer", // This would come from current user
        content: newPost,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        category: "general"
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const categories = [
    { id: 'allPosts', name: t.allPosts },
    { id: 'general', name: t.general },
    { id: 'cropAdvice', name: t.cropAdvice },
    { id: 'marketplace', name: t.marketplace },
    { id: 'weather', name: t.weather },
    { id: 'technology', name: t.technology }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Create Post */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">{t.createPost}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t.shareThoughts}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-24 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          <div className="flex justify-end">
            <Button onClick={handlePost} className="bg-green-600 hover:bg-green-700 text-white">
              <Send className="w-4 h-4 mr-2" />
              {t.post}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
            className={activeCategory === category.id ? 
              "bg-green-600 hover:bg-green-700 text-white" : 
              "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {getRoleIcon(post.role)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{post.author}</h3>
                    <Badge className={getRoleBadgeColor(post.role)}>
                      {post.role}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-red-600">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes} {t.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments} {t.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}