// Mock data for KrishiSeva application
// TODO: Replace with actual API calls

export const mockUsers = {
  farmers: [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91-98765-43210',
      location: 'Punjab, India',
      farmSize: '5 acres',
      crops: ['Rice', 'Wheat'],
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '+91-98765-43211',
      location: 'Maharashtra, India',
      farmSize: '3 acres',
      crops: ['Tomatoes', 'Onions'],
      joinDate: '2024-01-14',
      status: 'active'
    }
  ],
  retailers: [
    {
      id: 1,
      name: 'Green Valley Agro',
      email: 'contact@greenvalley.com',
      phone: '+91-98765-43220',
      location: 'Punjab, India',
      type: 'wholesale',
      products: ['Rice', 'Wheat', 'Maize'],
      rating: 4.8,
      joinDate: '2024-01-12',
      status: 'active'
    },
    {
      id: 2,
      name: 'FarmTech Solutions',
      email: 'info@farmtech.com',
      phone: '+91-98765-43221',
      location: 'Maharashtra, India',
      type: 'equipment',
      products: ['Tractors', 'Irrigation Systems'],
      rating: 4.6,
      joinDate: '2024-01-11',
      status: 'active'
    }
  ],
  labourers: [
    {
      id: 1,
      name: 'Suresh Yadav',
      phone: '+91-98765-43230',
      alternatePhone: '+91-98765-43231',
      skills: ['Plowing', 'Harvesting', 'Irrigation'],
      experience: '8 years',
      availability: 'full-time',
      location: 'Punjab, India',
      rating: 4.7,
      joinDate: '2024-01-10',
      status: 'active'
    },
    {
      id: 2,
      name: 'Manoj Kumar',
      phone: '+91-98765-43232',
      skills: ['Irrigation', 'Maintenance', 'Planting'],
      experience: '5 years',
      availability: 'part-time',
      location: 'Haryana, India',
      rating: 4.5,
      joinDate: '2024-01-09',
      status: 'active'
    }
  ]
};

export const mockProduce = [
  {
    id: 1,
    name: 'Basmati Rice',
    category: 'grains',
    price: '₹85/kg',
    quality: 'Premium',
    location: 'Punjab',
    farmer: 'Rajesh Kumar',
    image: '🌾',
    description: 'High quality basmati rice, perfect for export',
    harvestDate: '2024-01-10',
    quantity: '1000 kg'
  },
  {
    id: 2,
    name: 'Tomatoes',
    category: 'vegetables',
    price: '₹45/kg',
    quality: 'Fresh',
    location: 'Maharashtra',
    farmer: 'Priya Sharma',
    image: '🍅',
    description: 'Fresh red tomatoes, organically grown',
    harvestDate: '2024-01-12',
    quantity: '500 kg'
  }
];

export const mockMarketPrices = [
  { produce: 'Rice', price: '₹85/kg', change: '+5%', location: 'Punjab' },
  { produce: 'Wheat', price: '₹28/kg', change: '+2%', location: 'Haryana' },
  { produce: 'Tomatoes', price: '₹45/kg', change: '-3%', location: 'Maharashtra' },
  { produce: 'Onions', price: '₹35/kg', change: '+1%', location: 'Karnataka' },
  { produce: 'Potatoes', price: '₹25/kg', change: '+4%', location: 'Uttar Pradesh' }
];

export const mockGovernmentNotices = [
  {
    id: 1,
    title: 'PM Kisan Scheme - 15th Installment Released',
    schemeType: 'financial',
    date: '2024-01-15',
    priority: 'high',
    description: 'The 15th installment of ₹2000 under PM Kisan scheme has been released.',
    details: 'Direct benefit transfer to farmers\' bank accounts.',
    status: 'active'
  },
  {
    id: 2,
    title: 'Heavy Rainfall Alert - North India',
    schemeType: 'weather',
    date: '2024-01-14',
    priority: 'urgent',
    description: 'IMD has issued heavy rainfall warning for North India.',
    details: 'Farmers are advised to take necessary precautions.',
    status: 'active'
  }
];

export const mockEducationContent = [
  {
    id: 1,
    title: 'Modern Farming Techniques for Rice Cultivation',
    type: 'article',
    category: 'articles',
    author: 'Dr. Rajesh Kumar',
    duration: '8 min read',
    description: 'Learn about the latest techniques in rice cultivation.',
    rating: 4.8,
    views: 1250
  },
  {
    id: 2,
    title: 'Organic Farming: Complete Guide',
    type: 'video',
    category: 'videos',
    author: 'Green Farm Academy',
    duration: '45 min',
    description: 'Comprehensive video guide covering organic farming principles.',
    rating: 4.9,
    views: 3200
  }
];

export const mockLedgerEntries = [
  {
    id: 1,
    title: 'Traditional Seed Preservation',
    category: 'Wisdom',
    tags: ['seeds', 'storage', 'traditional'],
    summary: 'Store seeds in clay pots with neem leaves to deter pests.',
    date: '2024-01-10'
  },
  {
    id: 2,
    title: 'Organic Pest Control: Neem Spray',
    category: 'Guidance',
    tags: ['organic', 'pest', 'neem'],
    summary: 'Weekly neem oil spray helps control aphids and whiteflies.',
    date: '2024-01-14'
  },
  {
    id: 3,
    title: 'Intercropping to Reduce Pests',
    category: 'Insight',
    tags: ['intercropping', 'pest', 'organic'],
    summary: 'Plant marigold along with vegetables to naturally repel pests.',
    date: '2024-02-01'
  }
];

export const mockCommunityPosts = [
  {
    id: 1,
    title: 'Best time to plant tomatoes in North India?',
    author: 'Rajesh Kumar',
    date: '2024-01-15',
    content: 'I am planning to grow tomatoes in my farm in Punjab. What would be the best time to plant them?',
    category: 'Crop Planning',
    replies: 5,
    likes: 12
  },
  {
    id: 2,
    title: 'Organic pest control methods for rice',
    author: 'Priya Sharma',
    date: '2024-01-14',
    content: 'Looking for organic ways to control pests in my rice field.',
    category: 'Pest Control',
    replies: 8,
    likes: 15
  }
];

export const mockTransactions = [
  {
    id: 1,
    type: 'Produce Sale',
    amount: '₹15,000',
    farmer: 'Rajesh Kumar',
    retailer: 'Green Valley Agro',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: 2,
    type: 'Service Payment',
    amount: '₹5,000',
    farmer: 'Priya Sharma',
    labourer: 'Suresh Yadav',
    date: '2024-01-14',
    status: 'completed'
  }
];

export const mockDiseaseData = [
  {
    id: 1,
    name: 'Leaf Blight',
    symptoms: ['Brown spots on leaves', 'Yellowing of foliage', 'Reduced yield'],
    treatment: ['Remove affected leaves', 'Apply fungicide', 'Improve air circulation'],
    prevention: ['Plant resistant varieties', 'Maintain proper spacing', 'Regular crop rotation'],
    affectedCrops: ['Rice', 'Wheat', 'Maize']
  },
  {
    id: 2,
    name: 'Powdery Mildew',
    symptoms: ['White powdery coating', 'Stunted growth', 'Leaf curling'],
    treatment: ['Apply sulfur-based fungicide', 'Remove infected plants', 'Improve ventilation'],
    prevention: ['Avoid overhead watering', 'Plant in well-drained soil', 'Use resistant varieties'],
    affectedCrops: ['Tomatoes', 'Cucumbers', 'Squash']
  }
];

export const mockWeatherData = {
  current: {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    rainChance: 0
  },
  forecast: [
    { day: 'Mon', temp: 30, condition: 'Sunny', icon: '☀️' },
    { day: 'Tue', temp: 28, condition: 'Cloudy', icon: '⛅' },
    { day: 'Wed', temp: 26, condition: 'Rainy', icon: '🌧️' }
  ]
};

export const mockChatbotResponses = {
  greetings: [
    'Hello! Welcome to KrishiSeva. How can I help you today?',
    'Hi there! I\'m here to assist you with your farming questions.',
    'Welcome! What farming topic can I help you with?'
  ],
  disease: [
    'I can help you identify plant diseases. Please upload an image of the affected plant.',
    'For disease identification, use our Disease Checker tool with plant images.',
    'Upload a clear photo of the affected plant part for accurate diagnosis.'
  ],
  weather: [
    'For weather information, please check our Farm Planning section.',
    'Weather data is available in the Farm Planning tool.',
    'Check the weather widget in Farm Planning for current conditions.'
  ],
  market: [
    'You can find market prices and connect with retailers in our Retail Market section.',
    'Visit the Produce Gallery for current market prices.',
    'Check our Retail Market for buyer connections and pricing.'
  ],
  default: [
    'I understand you need help. For comprehensive support, please register and use our Query Page.',
    'For detailed assistance, please use our Query Page for expert help.',
    'I can provide basic information. For detailed support, please use our Query Page.'
  ]
};


