# KrishiSeva Frontend

A comprehensive agricultural platform frontend built with React, providing tailored experiences for farmers, retailers, laborers, and administrators.

## 🌟 Features

### 🏠 Homepage
- **Public Access**: Non-logged users can access the AI chatbot
- **Role-based Registration**: Different registration flows for each user type
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Theme Support**: Light and dark mode with green color scheme

### 👥 User Types & Dashboards

#### 🌾 Farmer Dashboard
- Crop management and tracking
- Weather information and farming tips
- Market prices and analytics
- AI-powered farming advice
- Revenue tracking and statistics

#### 🏪 Retailer Dashboard
- Product and inventory management
- Order tracking and analytics
- Customer support tools
- Market insights and pricing
- Business performance metrics

#### 👷 Laborer Dashboard
- Job search and applications
- Earnings tracking
- Skill showcase
- Work history and ratings
- Available opportunities

#### 👨‍💼 Admin Dashboard
- User management and analytics
- System monitoring
- Support ticket management
- Platform-wide statistics
- Administrative controls

### 🤖 AI Chatbot
- **Intelligent Responses**: Context-aware farming advice
- **Quick Questions**: Pre-defined common queries
- **Multi-language Support**: English, Hindi, and Malayalam
- **Real-time Interaction**: Instant responses to user queries
- **Farming Expertise**: Specialized knowledge in agriculture

### 📞 Contact & Support
- **Multiple Contact Methods**:
  - Phone call placeholder
  - WhatsApp integration placeholder
  - Email support
  - Contact form
- **Admin Contact Information**: Centralized support system
- **Business Hours**: Clear availability information
- **Emergency Support**: 24/7 helpline for urgent issues

### ⭐ Rating System
- **Transaction Ratings**: 5-star rating system for successful transactions
- **Quick Feedback**: Thumbs up/down for quick responses
- **Detailed Reviews**: Optional written feedback
- **Rating Display**: Show average ratings and review counts

### 🎨 Theme System
- **Light Mode**: Clean, bright interface with light green accents
- **Dark Mode**: Easy-on-eyes dark theme with dark green accents
- **Automatic Persistence**: Remembers user's theme preference
- **Smooth Transitions**: Seamless theme switching

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout component
│   │   ├── Chatbot.jsx         # AI chatbot interface
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── ThemeContext.jsx    # Theme management context
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── Dashboard.jsx       # Role-based dashboards
│   │   └── Contact.jsx         # Contact and support page
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Custom styles
│   ├── index.css               # Global styles
│   └── main.jsx                # App entry point
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the client directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=KrishiSeva
```

### API Integration
The frontend is configured to communicate with the backend API running on port 5000. All API calls are made through the `AuthContext` and individual components.

## 🎨 Styling

The application uses a combination of:
- **Tailwind CSS**: For utility-first styling
- **Custom CSS**: For theme-specific styles and animations
- **CSS Variables**: For dynamic theming
- **Responsive Design**: Mobile-first approach

### Color Scheme
- **Primary Green**: `#22c55e` (light) / `#4ade80` (dark)
- **Secondary Green**: `#dcfce7` (light) / `#052e16` (dark)
- **Accent Green**: `#bbf7d0` (light) / `#14532d` (dark)

## 🔐 Authentication

The app uses JWT-based authentication with:
- **Login/Register**: Phone number and password-based
- **Role-based Access**: Different dashboards for each user type
- **Protected Routes**: Automatic redirection based on auth status
- **Token Management**: Automatic token refresh and storage

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch-friendly**: Large touch targets and intuitive gestures

## 🌐 Internationalization

Currently supports:
- **English**: Primary language
- **Hindi**: हिन्दी support
- **Malayalam**: മലയാളം support

Language preferences are stored in localStorage and synced with user profile.

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm test
```

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: support@krishiseva.com
- **Phone**: +91 9876543210
- **Documentation**: Check the project README

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Offline support
- [ ] Advanced AI features
- [ ] Multi-tenant support
- [ ] Advanced reporting
- [ ] Integration with IoT devices

---

Made with ❤️ for the agricultural community