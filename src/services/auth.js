// Authentication and subscription management service
import { storageService } from './api.js';

// Mock user database (in production, this would be a real backend)
const MOCK_USERS = [
  {
    id: 1,
    email: 'demo@diginerplus.com',
    name: 'Demo User',
    password: 'demo123', // In production, this would be hashed
    subscription: 'free',
    usageCredits: 10,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    email: 'pro@diginerplus.com',
    name: 'Pro User',
    password: 'pro123',
    subscription: 'pro',
    usageCredits: 100,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 10,
    features: [
      'Basic idea generation',
      'Limited copy analysis',
      'Community insights',
      'Email support'
    ],
    limits: {
      ideasPerMonth: 10,
      copyAnalysisPerMonth: 5,
      outreachSequences: 1,
      projectsMax: 2
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    credits: 100,
    features: [
      'Advanced AI idea generation',
      'Detailed copy analysis',
      'Automated outreach sequences',
      'Community sentiment analysis',
      'Priority support',
      'Export capabilities'
    ],
    limits: {
      ideasPerMonth: 100,
      copyAnalysisPerMonth: 50,
      outreachSequences: 10,
      projectsMax: 10
    }
  },
  premium: {
    name: 'Premium',
    price: 99,
    credits: 500,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom AI training',
      'Advanced analytics',
      'API access',
      'White-label options',
      'Dedicated support'
    ],
    limits: {
      ideasPerMonth: 500,
      copyAnalysisPerMonth: 200,
      outreachSequences: 50,
      projectsMax: 50,
      teamMembers: 10
    }
  }
};

// Authentication service
export const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Store user session
      storageService.save('diginer_user', userWithoutPassword);
      storageService.save('diginer_session', {
        userId: user.id,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        password: userData.password, // In production, hash this
        subscription: 'free',
        usageCredits: SUBSCRIPTION_TIERS.free.credits,
        createdAt: new Date().toISOString()
      };

      // Add to mock database
      MOCK_USERS.push(newUser);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store user session
      storageService.save('diginer_user', userWithoutPassword);
      storageService.save('diginer_session', {
        userId: newUser.id,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  },

  /**
   * Logout user
   */
  logout() {
    storageService.remove('diginer_user');
    storageService.remove('diginer_session');
  },

  /**
   * Get current user from storage
   */
  getCurrentUser() {
    const user = storageService.load('diginer_user');
    const session = storageService.load('diginer_session');

    if (!user || !session) {
      return null;
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      this.logout();
      return null;
    }

    return user;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Update user profile
   */
  async updateProfile(updates) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = { ...currentUser, ...updates };
      
      // Update in mock database
      const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updates };
      }

      // Update stored user
      storageService.save('diginer_user', updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }
};

// Subscription service
export const subscriptionService = {
  /**
   * Get user's current subscription details
   */
  getSubscription(user) {
    if (!user) return null;
    
    const tier = SUBSCRIPTION_TIERS[user.subscription] || SUBSCRIPTION_TIERS.free;
    return {
      ...tier,
      currentTier: user.subscription,
      usageCredits: user.usageCredits || 0,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
  },

  /**
   * Upgrade subscription
   */
  async upgradeSubscription(newTier) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (!SUBSCRIPTION_TIERS[newTier]) {
        throw new Error('Invalid subscription tier');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedUser = await authService.updateProfile({
        subscription: newTier,
        usageCredits: SUBSCRIPTION_TIERS[newTier].credits
      });

      return {
        success: true,
        user: updatedUser,
        subscription: this.getSubscription(updatedUser)
      };
    } catch (error) {
      throw new Error(`Subscription upgrade failed: ${error.message}`);
    }
  },

  /**
   * Check if user can perform action based on subscription limits
   */
  canPerformAction(user, action, currentUsage = {}) {
    const subscription = this.getSubscription(user);
    if (!subscription) return false;

    const limits = subscription.limits;
    
    switch (action) {
      case 'generateIdeas':
        return currentUsage.ideasThisMonth < limits.ideasPerMonth;
      case 'analyzeCopy':
        return currentUsage.copyAnalysisThisMonth < limits.copyAnalysisPerMonth;
      case 'createOutreach':
        return currentUsage.outreachSequences < limits.outreachSequences;
      case 'createProject':
        return currentUsage.projects < limits.projectsMax;
      default:
        return true;
    }
  },

  /**
   * Use credits for an action
   */
  async useCredits(amount = 1) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (currentUser.usageCredits < amount) {
        throw new Error('Insufficient credits');
      }

      const updatedUser = await authService.updateProfile({
        usageCredits: currentUser.usageCredits - amount
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Credit usage failed: ${error.message}`);
    }
  },

  /**
   * Get usage statistics for current month
   */
  getUsageStats(user) {
    // In a real app, this would fetch from backend
    // For now, return mock data based on stored activities
    const projects = storageService.load('diginer_projects', []);
    const ideas = storageService.load('diginer_ideas', []);
    const analyses = storageService.load('diginer_analyses', []);
    const sequences = storageService.load('diginer_sequences', []);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthFilter = (item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    };

    return {
      projects: projects.length,
      ideasThisMonth: ideas.filter(thisMonthFilter).length,
      copyAnalysisThisMonth: analyses.filter(thisMonthFilter).length,
      outreachSequences: sequences.length
    };
  }
};

// Export all auth-related services
export default {
  auth: authService,
  subscription: subscriptionService,
  tiers: SUBSCRIPTION_TIERS
};
