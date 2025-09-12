# KrishiSeva - Agricultural Platform

A comprehensive React-based agricultural platform designed to connect farmers, retailers, and laborers with modern farming solutions.

## 🌟 Features

### Core Functionality
- **Disease Checker**: Upload plant images for AI-powered disease identification
- **Farm Planning**: Smart crop planning with weather integration and recommendations
- **Community Chat**: Forum-style discussions for farmers to share knowledge
- **Retail Market**: Connect with retailers and service providers
- **Produce Gallery**: Showcase and discover agricultural products with market prices
- **Education Hub**: Access articles, videos, and courses on modern farming
- **Query System**: Get expert help with structured query forms
- **Government Notices**: Stay updated with latest agricultural schemes and alerts
- **Admin Dashboard**: Comprehensive management system for platform administrators

### User Experience
- **Multilingual Support**: English, Hindi, and Malayalam with dynamic translation
- **Light/Dark Mode**: System preference detection with soothing green/white theme
- **Responsive Design**: Fully responsive across all devices
- **Accessibility**: Proper fonts, contrast, and rendering for Hindi/Malayalam
- **Floating Chatbot**: Site-wide assistance with mock responses and user redirection

### Authentication & Roles
- **Role-based Registration**: Farmers, Retailers, Labourers, and Admins
- **Role-specific Forms**: Tailored registration flows for each user type
- **Smart Redirection**: Automatic routing based on user role after login

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd krishi-seva
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header with search and language toggle
│   ├── Footer.jsx      # Site footer with links and information
│   ├── Layout.jsx      # Main layout wrapper
│   └── Chatbot.jsx     # Floating chatbot component
├── pages/              # Page components
│   ├── HomePage.jsx    # Landing page with hero and features
│   ├── DiseaseChecker.jsx
│   ├── FarmPlanning.jsx
│   ├── CommunityChat.jsx
│   ├── RetailMarket.jsx
│   ├── ProduceGallery.jsx
│   ├── EducationHub.jsx
│   ├── QueryPage.jsx
│   ├── GovernmentNotices.jsx
│   ├── AdminDashboard.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── contexts/           # React contexts
│   ├── ThemeContext.jsx    # Theme management
│   └── LanguageContext.jsx # Language management
├── utils/              # Utility functions
│   └── translations.js # Translation system
├── mock/               # Mock data and API endpoints
│   ├── apiEndpoints.js # API endpoint documentation
│   └── mockData.js     # Sample data for development
└── styles/             # Styling
    ├── global.css      # Global styles and CSS variables
    └── theme.js        # Theme configuration
```

## 🎨 Design System

### Color Scheme
- **Primary**: Deep Green (#2E7D32)
- **Secondary**: Light Green (#8BC34A)
- **Accent**: Amber (#FFC107)
- **Background**: White (Light) / Dark (#121212)
- **Text**: Dark Gray (Light) / White (Dark)

### Typography
- **Primary Font**: Inter, Noto Sans
- **Hindi Font**: Noto Sans Devanagari
- **Malayalam Font**: Noto Sans Malayalam

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 API Integration

The application is designed for easy backend integration. All API endpoints are documented in `src/mock/apiEndpoints.js` with clear TODO markers for implementation.

### New APIs Overview

Auth
- POST `/api/auth/login`, POST `/api/auth/logout`, POST `/api/auth/refresh`

Information Ledger
- GET `/api/ledger` (query: `q`, `tag`, `category`), POST `/api/ledger`, GET `/api/ledger/:id`, PUT `/api/ledger/:id`, DELETE `/api/ledger/:id`

Schedule / Calendar
- GET `/api/schedule/events`, POST `/api/schedule/events`, PUT `/api/schedule/events/:id`, DELETE `/api/schedule/events/:id`
- POST `/api/schedule/alerts/subscribe`, POST `/api/schedule/alerts/unsubscribe`

Calling Agent (Twilio placeholder)
- POST `/api/agent/call`, POST `/api/agent/sms`, GET `/api/agent/call/:id/status`

Chatbot
- POST `/api/chat`, GET `/api/chat/history/:userId`, DELETE `/api/chat/history/:userId`

Education
- GET `/api/education/articles|videos|courses`, POST `/api/education/articles`, GET `/api/education/*/:id`, POST `/api/education/courses/:id/enroll`

Government Notices
- GET `/api/notices`, POST `/api/notices`, GET `/api/notices/:id`

## 🌐 Multilingual Support

The application supports three languages:
- **English** (en)
- **Hindi** (hi) - हिन्दी
- **Malayalam** (ml) - മലയാളം

Language switching is available in the header and persists across sessions.

## 🎯 User Roles

### Farmer
- Farm location and crop information
- Access to all farming tools and resources
- Direct connection with retailers and laborers

### Retailer
- Business information and license details
- Product catalog management
- Market price tracking

### Labourer
- Skills and experience profile
- Availability and location information
- Service offering capabilities

### Admin
- Platform management and analytics
- User management and moderation
- Content and notice management

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration included
- Consistent component structure
- Proper prop validation
- Accessibility considerations

## 📱 Features in Detail

### Disease Checker
- Image upload with preview (JPEG/PNG, <5MB)
- Mock AI analysis with confidence scores
- Treatment and prevention recommendations
- Future ML integration ready

### Farm Planning
- Comprehensive form with location, crop, and season data
- Weather widget integration
- AI-powered recommendations
- Cost and yield estimation

### Community Chat
- Forum-style posts and comments
- Category-based organization
- Like and reply functionality
- Real-time updates (mock)

### Retail Market
- Advanced filtering and search
- Category-based browsing
- Contact and rating system
- Service provider profiles

### Produce Gallery
- Sortable market price table
- Category filtering
- Quality indicators
- Seller contact information

### Education Hub
- Articles, videos, and courses
- Rating and view tracking
- Featured content sections
- Progress tracking (future)

### Query System
- Structured form with categories
- File attachment support
- Priority levels
- Expert response system

### Government Notices
- Scheme type filtering
- Priority indicators
- Detailed information
- Quick links to resources

### Admin Dashboard
- User management (CRUD operations)
- Transaction monitoring
- System status tracking
- Analytics and reporting

## 🔮 Future Enhancements

- Real AI/ML integration for disease detection
- Payment gateway integration
- Real-time chat functionality
- Mobile app development
- Advanced analytics and reporting
- IoT device integration
- Blockchain for supply chain tracking

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and queries, please use the Query Page within the application or contact the development team.

---

**Made with ❤️ for Indian Farmers**