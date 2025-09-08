import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  currentView: 'dashboard',
  subscription: 'free', // free, pro, premium
  usageCredits: 10,
  projects: [],
  generatedIdeas: [],
  copyAnalyses: [],
  outreachSequences: [],
  isLoading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_PROJECT':
      return { 
        ...state, 
        projects: [...state.projects, { ...action.payload, id: Date.now() }]
      };
    case 'ADD_GENERATED_IDEA':
      return { 
        ...state, 
        generatedIdeas: [...state.generatedIdeas, action.payload],
        usageCredits: Math.max(0, state.usageCredits - 1)
      };
    case 'ADD_COPY_ANALYSIS':
      return { 
        ...state, 
        copyAnalyses: [...state.copyAnalyses, action.payload],
        usageCredits: Math.max(0, state.usageCredits - 1)
      };
    case 'ADD_OUTREACH_SEQUENCE':
      return { 
        ...state, 
        outreachSequences: [...state.outreachSequences, action.payload]
      };
    case 'USE_CREDIT':
      return { 
        ...state, 
        usageCredits: Math.max(0, state.usageCredits - 1)
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate user login on mount
  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: 'SET_USER',
        payload: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe'
        }
      });
    }, 1000);
  }, []);

  const setView = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const addProject = (project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const generateIdeas = async (projectData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock AI idea generation - replace with actual OpenAI API call
      const mockIdeas = [
        {
          id: Date.now() + 1,
          title: `AI-Powered ${projectData.niche} Assistant`,
          description: `A smart assistant that helps ${projectData.targetAudience} optimize their ${projectData.niche} strategies using machine learning.`,
          tags: ['AI', 'SaaS', projectData.niche],
          projectId: projectData.id
        },
        {
          id: Date.now() + 2,
          title: `${projectData.niche} Community Platform`,
          description: `An exclusive community where ${projectData.targetAudience} can share insights, network, and collaborate on ${projectData.niche} projects.`,
          tags: ['Community', 'Platform', projectData.niche],
          projectId: projectData.id
        },
        {
          id: Date.now() + 3,
          title: `Automated ${projectData.niche} Analytics`,
          description: `Real-time analytics dashboard that tracks ${projectData.niche} performance metrics and provides actionable insights.`,
          tags: ['Analytics', 'Dashboard', projectData.niche],
          projectId: projectData.id
        }
      ];

      setTimeout(() => {
        mockIdeas.forEach(idea => {
          dispatch({ type: 'ADD_GENERATED_IDEA', payload: idea });
        });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 2000);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const analyzeCopy = async (copyText) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock copy analysis - replace with actual OpenAI API call
      const mockAnalysis = {
        id: Date.now(),
        copyText,
        score: 75,
        analysisResult: {
          clarity: 8,
          engagement: 7,
          persuasiveness: 6,
          issues: [
            'Consider adding more emotional hooks',
            'Call-to-action could be stronger',
            'Add social proof elements'
          ]
        },
        suggestedImprovements: [
          {
            original: copyText.split('.')[0],
            improved: copyText.split('.')[0] + ' - and transform your business today',
            reason: 'Added urgency and benefit'
          }
        ],
        createdAt: new Date().toISOString()
      };

      setTimeout(() => {
        dispatch({ type: 'ADD_COPY_ANALYSIS', payload: mockAnalysis });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1500);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createOutreachSequence = async (sequenceData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock outreach sequence creation
      const mockSequence = {
        id: Date.now(),
        ...sequenceData,
        messages: [
          {
            day: 1,
            subject: `${sequenceData.sequenceName} - Introduction`,
            content: `Hi {{firstName}}, I noticed you're interested in ${sequenceData.niche}. I'd love to share some insights that could help...`
          },
          {
            day: 3,
            subject: `Following up on ${sequenceData.niche}`,
            content: `Hi {{firstName}}, I wanted to follow up on my previous message about ${sequenceData.niche}...`
          },
          {
            day: 7,
            subject: `Last chance: ${sequenceData.niche} insights`,
            content: `Hi {{firstName}}, This is my final message about the ${sequenceData.niche} opportunity...`
          }
        ],
        createdAt: new Date().toISOString()
      };

      setTimeout(() => {
        dispatch({ type: 'ADD_OUTREACH_SEQUENCE', payload: mockSequence });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1000);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    setView,
    addProject,
    generateIdeas,
    analyzeCopy,
    createOutreachSequence,
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