import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { openaiService, redditService, storageService } from '../services/api.js';
import { authService, subscriptionService } from '../services/auth.js';

const AppContext = createContext();

const initialState = {
  user: null,
  currentView: 'dashboard',
  subscription: null,
  usageCredits: 0,
  projects: [],
  generatedIdeas: [],
  copyAnalyses: [],
  outreachSequences: [],
  communityInsights: [],
  chatMessages: [],
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload,
        subscription: action.payload ? subscriptionService.getSubscription(action.payload) : null,
        usageCredits: action.payload?.usageCredits || 0
      };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { 
        ...state, 
        projects: [...state.projects, { ...action.payload, id: Date.now() }]
      };
    case 'SET_GENERATED_IDEAS':
      return { ...state, generatedIdeas: action.payload };
    case 'ADD_GENERATED_IDEAS':
      return { 
        ...state, 
        generatedIdeas: [...state.generatedIdeas, ...action.payload]
      };
    case 'SET_COPY_ANALYSES':
      return { ...state, copyAnalyses: action.payload };
    case 'ADD_COPY_ANALYSIS':
      return { 
        ...state, 
        copyAnalyses: [...state.copyAnalyses, action.payload]
      };
    case 'SET_OUTREACH_SEQUENCES':
      return { ...state, outreachSequences: action.payload };
    case 'ADD_OUTREACH_SEQUENCE':
      return { 
        ...state, 
        outreachSequences: [...state.outreachSequences, action.payload]
      };
    case 'SET_COMMUNITY_INSIGHTS':
      return { ...state, communityInsights: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { 
        ...state, 
        chatMessages: [...state.chatMessages, action.payload]
      };
    case 'SET_CHAT_MESSAGES':
      return { ...state, chatMessages: action.payload };
    case 'UPDATE_SUBSCRIPTION':
      return { 
        ...state, 
        subscription: action.payload,
        usageCredits: action.payload?.usageCredits || state.usageCredits
      };
    case 'LOGOUT':
      return { 
        ...initialState,
        currentView: 'login'
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for existing user session
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          dispatch({ type: 'SET_USER', payload: currentUser });
          
          // Load user data from storage
          const projects = storageService.load('diginer_projects', []);
          const ideas = storageService.load('diginer_ideas', []);
          const analyses = storageService.load('diginer_analyses', []);
          const sequences = storageService.load('diginer_sequences', []);
          const insights = storageService.load('diginer_insights', []);
          
          dispatch({ type: 'SET_PROJECTS', payload: projects });
          dispatch({ type: 'SET_GENERATED_IDEAS', payload: ideas });
          dispatch({ type: 'SET_COPY_ANALYSES', payload: analyses });
          dispatch({ type: 'SET_OUTREACH_SEQUENCES', payload: sequences });
          dispatch({ type: 'SET_COMMUNITY_INSIGHTS', payload: insights });
        } else {
          // No user session, show login
          dispatch({ type: 'SET_VIEW', payload: 'login' });
        }
      } catch (error) {
        console.error('App initialization error:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize app' });
      }
    };

    initializeApp();
  }, []);

  // Authentication functions
  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const user = await authService.register(userData);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    authService.logout();
    storageService.clear();
    dispatch({ type: 'LOGOUT' });
  };

  const setView = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const addProject = (project) => {
    const newProject = { ...project, id: Date.now() };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    
    // Save to storage
    const projects = [...state.projects, newProject];
    storageService.save('diginer_projects', projects);
  };

  const generateIdeas = async (projectData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      // Check subscription limits
      const usageStats = subscriptionService.getUsageStats(state.user);
      if (!subscriptionService.canPerformAction(state.user, 'generateIdeas', usageStats)) {
        throw new Error('Monthly idea generation limit reached. Please upgrade your subscription.');
      }

      // Use real OpenAI API
      const ideas = await openaiService.generateIdeas(projectData);
      
      // Update state
      dispatch({ type: 'ADD_GENERATED_IDEAS', payload: ideas });
      
      // Save to storage
      const allIdeas = [...state.generatedIdeas, ...ideas];
      storageService.save('diginer_ideas', allIdeas);
      
      // Use credits
      await subscriptionService.useCredits(ideas.length);
      const updatedUser = authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const analyzeCopy = async (copyText) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      // Check subscription limits
      const usageStats = subscriptionService.getUsageStats(state.user);
      if (!subscriptionService.canPerformAction(state.user, 'analyzeCopy', usageStats)) {
        throw new Error('Monthly copy analysis limit reached. Please upgrade your subscription.');
      }

      // Use real OpenAI API
      const analysis = await openaiService.analyzeCopy(copyText);
      
      // Update state
      dispatch({ type: 'ADD_COPY_ANALYSIS', payload: analysis });
      
      // Save to storage
      const allAnalyses = [...state.copyAnalyses, analysis];
      storageService.save('diginer_analyses', allAnalyses);
      
      // Use credits
      await subscriptionService.useCredits(1);
      const updatedUser = authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createOutreachSequence = async (sequenceData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      // Check subscription limits
      const usageStats = subscriptionService.getUsageStats(state.user);
      if (!subscriptionService.canPerformAction(state.user, 'createOutreach', usageStats)) {
        throw new Error('Outreach sequence limit reached. Please upgrade your subscription.');
      }

      // Use real OpenAI API
      const sequence = await openaiService.generateOutreachSequence(sequenceData);
      
      // Update state
      dispatch({ type: 'ADD_OUTREACH_SEQUENCE', payload: sequence });
      
      // Save to storage
      const allSequences = [...state.outreachSequences, sequence];
      storageService.save('diginer_sequences', allSequences);
      
      // Use credits
      await subscriptionService.useCredits(2);
      const updatedUser = authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // New functions for additional features
  const getCommunityInsights = async (niche) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      // Fetch trending topics from Reddit
      const trendingPosts = await redditService.getTrendingTopics(niche, 20);
      
      // Analyze sentiment
      const sentimentAnalysis = await redditService.analyzeCommunitysentiment(trendingPosts);
      
      const insights = {
        id: Date.now(),
        niche,
        trendingPosts,
        sentiment: sentimentAnalysis,
        createdAt: new Date().toISOString()
      };
      
      // Update state
      dispatch({ type: 'SET_COMMUNITY_INSIGHTS', payload: [insights] });
      
      // Save to storage
      storageService.save('diginer_insights', [insights]);
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const chatWithAssistant = async (message, context = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      // Add user message
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
      
      // Get AI response
      const messages = [...state.chatMessages, userMessage];
      const assistantResponse = await openaiService.chatWithAssistant(messages, context);
      
      // Add assistant response
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: assistantResponse });
      
      // Use credits
      await subscriptionService.useCredits(1);
      const updatedUser = authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const upgradeSubscription = async (newTier) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const result = await subscriptionService.upgradeSubscription(newTier);
      dispatch({ type: 'SET_USER', payload: result.user });
      dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: result.subscription });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    // Authentication
    login,
    register,
    logout,
    // Navigation
    setView,
    // Core features
    addProject,
    generateIdeas,
    analyzeCopy,
    createOutreachSequence,
    getCommunityInsights,
    chatWithAssistant,
    // Subscription
    upgradeSubscription,
    // Utilities
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    getUsageStats: () => subscriptionService.getUsageStats(state.user),
    canPerformAction: (action) => {
      const usageStats = subscriptionService.getUsageStats(state.user);
      return subscriptionService.canPerformAction(state.user, action, usageStats);
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
