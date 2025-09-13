import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp, 
  MessageSquare, 
  Settings,
  Bell,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Load user-specific stats based on role
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    // Mock data - in real app, this would come from API
    const mockStats = {
      farmer: {
        totalCrops: 12,
        activeProjects: 3,
        monthlyRevenue: 45000,
        rating: 4.8,
        upcomingTasks: 5,
        recentActivities: [
          { id: 1, action: 'Planted rice seeds', time: '2 hours ago', status: 'completed' },
          { id: 2, action: 'Applied fertilizer', time: '1 day ago', status: 'completed' },
          { id: 3, action: 'Harvested wheat', time: '3 days ago', status: 'completed' }
        ]
      },
      retailer: {
        totalProducts: 45,
        activeOrders: 8,
        monthlyRevenue: 125000,
        rating: 4.6,
        pendingOrders: 3,
        recentActivities: [
          { id: 1, action: 'New order received', time: '1 hour ago', status: 'pending' },
          { id: 2, action: 'Product restocked', time: '4 hours ago', status: 'completed' },
          { id: 3, action: 'Order delivered', time: '1 day ago', status: 'completed' }
        ]
      },
      laborer: {
        totalJobs: 15,
        activeJobs: 2,
        monthlyEarnings: 25000,
        rating: 4.9,
        availableJobs: 7,
        recentActivities: [
          { id: 1, action: 'Job completed - Harvesting', time: '3 hours ago', status: 'completed' },
          { id: 2, action: 'New job assigned', time: '1 day ago', status: 'active' },
          { id: 3, action: 'Payment received', time: '2 days ago', status: 'completed' }
        ]
      },
      admin: {
        totalUsers: 1250,
        activeUsers: 980,
        monthlyRevenue: 500000,
        systemHealth: 99.8,
        pendingRequests: 12,
        recentActivities: [
          { id: 1, action: 'New user registered', time: '30 minutes ago', status: 'pending' },
          { id: 2, action: 'System backup completed', time: '2 hours ago', status: 'completed' },
          { id: 3, action: 'Support ticket resolved', time: '4 hours ago', status: 'completed' }
        ]
      }
    };

    setStats(mockStats[user?.role] || {});
  };

  const getRoleIcon = (role) => {
    const icons = {
      farmer: '🌾',
      retailer: '🏪',
      laborer: '👷',
      admin: '👨‍💼'
    };
    return icons[role] || '👤';
  };

  const getRoleColor = (role) => {
    const colors = {
      farmer: 'text-green-600',
      retailer: 'text-blue-600',
      laborer: 'text-orange-600',
      admin: 'text-purple-600'
    };
    return colors[role] || 'text-gray-600';
  };

  const getDashboardCards = () => {
    if (!user) return [];

    switch (user.role) {
      case 'farmer':
        return [
          { title: 'Total Crops', value: stats.totalCrops, icon: BarChart3, color: 'text-green-600' },
          { title: 'Active Projects', value: stats.activeProjects, icon: TrendingUp, color: 'text-blue-600' },
          { title: 'Monthly Revenue', value: `₹${stats.monthlyRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
          { title: 'Rating', value: stats.rating, icon: Star, color: 'text-yellow-600' }
        ];
      case 'retailer':
        return [
          { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600' },
          { title: 'Active Orders', value: stats.activeOrders, icon: TrendingUp, color: 'text-green-600' },
          { title: 'Monthly Revenue', value: `₹${stats.monthlyRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
          { title: 'Rating', value: stats.rating, icon: Star, color: 'text-yellow-600' }
        ];
      case 'laborer':
        return [
          { title: 'Total Jobs', value: stats.totalJobs, icon: BarChart3, color: 'text-orange-600' },
          { title: 'Active Jobs', value: stats.activeJobs, icon: Clock, color: 'text-blue-600' },
          { title: 'Monthly Earnings', value: `₹${stats.monthlyEarnings?.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
          { title: 'Rating', value: stats.rating, icon: Star, color: 'text-yellow-600' }
        ];
      case 'admin':
        return [
          { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600' },
          { title: 'Active Users', value: stats.activeUsers, icon: TrendingUp, color: 'text-green-600' },
          { title: 'Monthly Revenue', value: `₹${stats.monthlyRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
          { title: 'System Health', value: `${stats.systemHealth}%`, icon: CheckCircle, color: 'text-green-600' }
        ];
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    if (!user) return [];

    switch (user.role) {
      case 'farmer':
        return [
          { title: 'Ask AI Assistant', icon: MessageSquare, color: 'bg-blue-500', href: '/chatbot' },
          { title: 'View Crops', icon: BarChart3, color: 'bg-green-500', href: '#' },
          { title: 'Market Prices', icon: TrendingUp, color: 'bg-yellow-500', href: '#' },
          { title: 'Weather Forecast', icon: Calendar, color: 'bg-purple-500', href: '#' }
        ];
      case 'retailer':
        return [
          { title: 'Manage Products', icon: Package, color: 'bg-blue-500', href: '#' },
          { title: 'View Orders', icon: BarChart3, color: 'bg-green-500', href: '#' },
          { title: 'Analytics', icon: TrendingUp, color: 'bg-yellow-500', href: '#' },
          { title: 'Customer Support', icon: MessageSquare, color: 'bg-purple-500', href: '/contact' }
        ];
      case 'laborer':
        return [
          { title: 'Find Jobs', icon: BarChart3, color: 'bg-blue-500', href: '#' },
          { title: 'My Jobs', icon: Clock, color: 'bg-green-500', href: '#' },
          { title: 'Earnings', icon: DollarSign, color: 'bg-yellow-500', href: '#' },
          { title: 'Profile', icon: Settings, color: 'bg-purple-500', href: '#' }
        ];
      case 'admin':
        return [
          { title: 'User Management', icon: Users, color: 'bg-blue-500', href: '#' },
          { title: 'Analytics', icon: BarChart3, color: 'bg-green-500', href: '#' },
          { title: 'System Settings', icon: Settings, color: 'bg-yellow-500', href: '#' },
          { title: 'Support Tickets', icon: MessageSquare, color: 'bg-purple-500', href: '#' }
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{getRoleIcon(user.role)}</div>
            <div>
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back, {user.name}!
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-6 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {user.location?.state}, {user.location?.district}
              </span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {user.phone}
                </span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {user.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getDashboardCards().map((card, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {card.value}
                  </p>
                </div>
                <card.icon className={`w-8 h-8 ${card.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getQuickActions().map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className={`p-6 rounded-lg border text-center transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {action.title}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Activities
            </h2>
            <div className={`space-y-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {stats.recentActivities?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {activity.action}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role-specific additional content */}
        {user.role === 'farmer' && (
          <div className="mt-8">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Farming Tips
            </h2>
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                💡 <strong>Today's Tip:</strong> Make sure to water your crops early in the morning 
                to prevent evaporation and ensure maximum absorption. Check the weather forecast 
                before planning your irrigation schedule.
              </p>
            </div>
          </div>
        )}

        {user.role === 'retailer' && (
          <div className="mt-8">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Market Insights
            </h2>
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                📈 <strong>Market Update:</strong> Rice prices are up 5% this week due to increased demand. 
                Consider adjusting your inventory and pricing strategy accordingly.
              </p>
            </div>
          </div>
        )}

        {user.role === 'laborer' && (
          <div className="mt-8">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Available Jobs
            </h2>
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                🔍 <strong>Job Alert:</strong> There are {stats.availableJobs} new job opportunities 
                in your area. Check the job board to find work that matches your skills and schedule.
              </p>
            </div>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="mt-8">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              System Status
            </h2>
            <div className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ⚡ <strong>System Health:</strong> All systems are running smoothly. 
                {stats.pendingRequests} pending requests need your attention. 
                Server response time is optimal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
