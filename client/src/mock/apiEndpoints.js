// API Endpoints documentation for KrishiSeva
// TODO: Replace with actual backend implementation

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: 'POST /api/auth/login',
    REGISTER_FARMER: 'POST /api/register/farmer',
    REGISTER_RETAILER: 'POST /api/register/retailer',
    REGISTER_LABOURER: 'POST /api/register/labourer',
    REGISTER_ADMIN: 'POST /api/register/admin',
    LOGOUT: 'POST /api/auth/logout',
    REFRESH_TOKEN: 'POST /api/auth/refresh'
  },

  // User Management
  USERS: {
    GET_PROFILE: 'GET /api/users/profile',
    UPDATE_PROFILE: 'PUT /api/users/profile',
    GET_FARMERS: 'GET /api/users/farmers',
    GET_RETAILERS: 'GET /api/users/retailers',
    GET_LABOURERS: 'GET /api/users/labourers',
    GET_ADMINS: 'GET /api/users/admins'
  },

  // Disease Checker
  DISEASE: {
    UPLOAD_IMAGE: 'POST /api/disease/upload',
    GET_ANALYSIS: 'GET /api/disease/analysis/:id',
    GET_DISEASE_INFO: 'GET /api/disease/info/:diseaseId',
    GET_TREATMENT: 'GET /api/disease/treatment/:diseaseId'
  },

  // Farm Planning
  FARM_PLANNING: {
    CREATE_PLAN: 'POST /api/farm-planning/create',
    GET_PLANS: 'GET /api/farm-planning/user/:userId',
    UPDATE_PLAN: 'PUT /api/farm-planning/:planId',
    DELETE_PLAN: 'DELETE /api/farm-planning/:planId',
    GET_WEATHER: 'GET /api/weather/:location'
  },

  // Community Chat
  COMMUNITY: {
    GET_POSTS: 'GET /api/community/posts',
    CREATE_POST: 'POST /api/community/posts',
    GET_POST: 'GET /api/community/posts/:id',
    UPDATE_POST: 'PUT /api/community/posts/:id',
    DELETE_POST: 'DELETE /api/community/posts/:id',
    GET_COMMENTS: 'GET /api/community/posts/:id/comments',
    CREATE_COMMENT: 'POST /api/community/posts/:id/comments',
    LIKE_POST: 'POST /api/community/posts/:id/like'
  },

  // Retail Market
  MARKET: {
    GET_RETAILERS: 'GET /api/market/retailers',
    GET_RETAILER: 'GET /api/market/retailers/:id',
    CREATE_RETAILER: 'POST /api/market/retailers',
    UPDATE_RETAILER: 'PUT /api/market/retailers/:id',
    DELETE_RETAILER: 'DELETE /api/market/retailers/:id',
    SEARCH_RETAILERS: 'GET /api/market/retailers/search'
  },

  // Produce Gallery
  PRODUCE: {
    GET_PRODUCE: 'GET /api/produce',
    UPLOAD_PRODUCE: 'POST /api/produce/upload',
    GET_PRODUCE_ITEM: 'GET /api/produce/:id',
    UPDATE_PRODUCE: 'PUT /api/produce/:id',
    DELETE_PRODUCE: 'DELETE /api/produce/:id',
    GET_MARKET_PRICES: 'GET /api/market-prices',
    UPDATE_MARKET_PRICE: 'PUT /api/market-prices/:id'
  },

  // Education Hub
  EDUCATION: {
    GET_ARTICLES: 'GET /api/education/articles',
    GET_ARTICLE: 'GET /api/education/articles/:id',
    CREATE_ARTICLE: 'POST /api/education/articles',
    GET_VIDEOS: 'GET /api/education/videos',
    GET_VIDEO: 'GET /api/education/videos/:id',
    GET_COURSES: 'GET /api/education/courses',
    GET_COURSE: 'GET /api/education/courses/:id',
    ENROLL_COURSE: 'POST /api/education/courses/:id/enroll'
  },

  // Query System
  QUERIES: {
    CREATE_QUERY: 'POST /api/query',
    GET_QUERIES: 'GET /api/query/user/:userId',
    GET_QUERY: 'GET /api/query/:id',
    UPDATE_QUERY: 'PUT /api/query/:id',
    DELETE_QUERY: 'DELETE /api/query/:id',
    GET_ADMIN_QUERIES: 'GET /api/query/admin',
    RESPOND_QUERY: 'POST /api/query/:id/respond'
  },

  // Government Notices
  NOTICES: {
    GET_NOTICES: 'GET /api/notices',
    GET_NOTICE: 'GET /api/notices/:id',
    CREATE_NOTICE: 'POST /api/notices',
    UPDATE_NOTICE: 'PUT /api/notices/:id',
    DELETE_NOTICE: 'DELETE /api/notices/:id',
    GET_NOTICES_BY_SCHEME: 'GET /api/notices/scheme/:schemeType'
  },

  // Admin Dashboard
  ADMIN: {
    GET_DASHBOARD_STATS: 'GET /api/admin/dashboard',
    GET_ALL_USERS: 'GET /api/admin/users',
    GET_ALL_TRANSACTIONS: 'GET /api/admin/transactions',
    UPDATE_USER_STATUS: 'PUT /api/admin/users/:id/status',
    DELETE_USER: 'DELETE /api/admin/users/:id',
    GET_SYSTEM_LOGS: 'GET /api/admin/logs',
    GET_ANALYTICS: 'GET /api/admin/analytics'
  },

  // Chatbot
  CHATBOT: {
    SEND_MESSAGE: 'POST /api/chat',
    GET_CHAT_HISTORY: 'GET /api/chat/history/:userId',
    CLEAR_CHAT_HISTORY: 'DELETE /api/chat/history/:userId'
  },

  // Translations
  TRANSLATIONS: {
    GET_TRANSLATIONS: 'GET /api/translations/:lang',
    UPDATE_TRANSLATIONS: 'PUT /api/translations/:lang'
  },

  // File Upload
  UPLOAD: {
    UPLOAD_IMAGE: 'POST /api/upload/image',
    UPLOAD_DOCUMENT: 'POST /api/upload/document',
    DELETE_FILE: 'DELETE /api/upload/:fileId'
  },

  // Notifications
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: 'GET /api/notifications/:userId',
    MARK_READ: 'PUT /api/notifications/:id/read',
    DELETE_NOTIFICATION: 'DELETE /api/notifications/:id',
    SEND_NOTIFICATION: 'POST /api/notifications/send'
  },

  // Information Ledger (Knowledge Bank)
  LEDGER: {
    GET_ENTRIES: 'GET /api/ledger',
    CREATE_ENTRY: 'POST /api/ledger',
    GET_ENTRY: 'GET /api/ledger/:id',
    UPDATE_ENTRY: 'PUT /api/ledger/:id',
    DELETE_ENTRY: 'DELETE /api/ledger/:id',
    SEARCH: 'GET /api/ledger/search?q={term}&tag={tag}&category={category}'
  },

  // Schedule / Calendar
  SCHEDULE: {
    GET_EVENTS: 'GET /api/schedule/events',
    CREATE_EVENT: 'POST /api/schedule/events',
    UPDATE_EVENT: 'PUT /api/schedule/events/:id',
    DELETE_EVENT: 'DELETE /api/schedule/events/:id',
    SUBSCRIBE_ALERTS: 'POST /api/schedule/alerts/subscribe',
    UNSUBSCRIBE_ALERTS: 'POST /api/schedule/alerts/unsubscribe'
  },

  // Calling Agent (Twilio placeholder)
  CALLING_AGENT: {
    INITIATE_CALL: 'POST /api/agent/call',
    SEND_SMS: 'POST /api/agent/sms',
    CALL_STATUS: 'GET /api/agent/call/:id/status'
  }
};

// Mock API response structure
export const MOCK_API_RESPONSE = {
  success: true,
  data: null,
  message: '',
  errors: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Common error responses
export const ERROR_RESPONSES = {
  UNAUTHORIZED: {
    success: false,
    message: 'Unauthorized access',
    errors: ['Authentication required']
  },
  FORBIDDEN: {
    success: false,
    message: 'Access forbidden',
    errors: ['Insufficient permissions']
  },
  NOT_FOUND: {
    success: false,
    message: 'Resource not found',
    errors: ['The requested resource does not exist']
  },
  VALIDATION_ERROR: {
    success: false,
    message: 'Validation failed',
    errors: []
  },
  SERVER_ERROR: {
    success: false,
    message: 'Internal server error',
    errors: ['An unexpected error occurred']
  }
};


