// API service layer for Diginer Plus
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

// API Configuration
const API_CONFIG = {
  openai: {
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7,
  },
  reddit: {
    baseUrl: 'https://www.reddit.com',
    userAgent: 'DiginerPlus/1.0',
  }
};

// Error handling utility
const handleApiError = (error, context) => {
  console.error(`API Error in ${context}:`, error);
  throw new Error(`Failed to ${context}: ${error.message}`);
};

// OpenAI API Services
export const openaiService = {
  /**
   * Generate business ideas using OpenAI
   */
  async generateIdeas(projectData) {
    try {
      const prompt = `
        Generate 5 innovative business ideas for the following context:
        - Niche: ${projectData.niche}
        - Target Audience: ${projectData.targetAudience}
        - Business Goals: Growth and revenue generation
        
        For each idea, provide:
        1. A compelling title
        2. A detailed description (2-3 sentences)
        3. Key benefits
        4. Implementation difficulty (1-10)
        5. Revenue potential (1-10)
        
        Format as JSON array with objects containing: title, description, benefits, difficulty, revenue_potential, tags
      `;

      const response = await openai.chat.completions.create({
        model: API_CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a business strategy expert who generates innovative, actionable business ideas. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: API_CONFIG.openai.maxTokens,
        temperature: API_CONFIG.openai.temperature,
      });

      const content = response.choices[0].message.content;
      const ideas = JSON.parse(content);
      
      return ideas.map((idea, index) => ({
        id: Date.now() + index,
        projectId: projectData.id,
        title: idea.title,
        description: idea.description,
        benefits: idea.benefits || [],
        difficulty: idea.difficulty || 5,
        revenuePotential: idea.revenue_potential || 5,
        tags: idea.tags || [projectData.niche],
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      handleApiError(error, 'generate ideas');
    }
  },

  /**
   * Analyze marketing copy using OpenAI
   */
  async analyzeCopy(copyText) {
    try {
      const prompt = `
        Analyze the following marketing copy and provide detailed feedback:
        
        "${copyText}"
        
        Provide analysis on:
        1. Overall effectiveness score (1-100)
        2. Clarity score (1-10)
        3. Engagement score (1-10)
        4. Persuasiveness score (1-10)
        5. Specific issues and improvements
        6. Suggested rewrites for weak sections
        
        Format as JSON with: overall_score, clarity, engagement, persuasiveness, issues (array), improvements (array of {original, improved, reason})
      `;

      const response = await openai.chat.completions.create({
        model: API_CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a marketing copy expert who provides detailed, actionable feedback on marketing materials. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: API_CONFIG.openai.maxTokens,
        temperature: 0.3, // Lower temperature for more consistent analysis
      });

      const content = response.choices[0].message.content;
      const analysis = JSON.parse(content);
      
      return {
        id: Date.now(),
        copyText,
        score: analysis.overall_score,
        analysisResult: {
          clarity: analysis.clarity,
          engagement: analysis.engagement,
          persuasiveness: analysis.persuasiveness,
          issues: analysis.issues || []
        },
        suggestedImprovements: analysis.improvements || [],
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      handleApiError(error, 'analyze copy');
    }
  },

  /**
   * Generate personalized outreach messages
   */
  async generateOutreachSequence(sequenceData) {
    try {
      const prompt = `
        Create a personalized outreach sequence for:
        - Sequence Name: ${sequenceData.sequenceName}
        - Target Audience: ${sequenceData.targetAudience}
        - Niche: ${sequenceData.niche}
        - Goal: ${sequenceData.goal || 'Lead generation and relationship building'}
        
        Generate 3 follow-up messages for days 1, 3, and 7:
        1. Initial introduction and value proposition
        2. Follow-up with additional value/case study
        3. Final follow-up with clear call-to-action
        
        Each message should include:
        - Subject line
        - Personalized content with {{firstName}} placeholder
        - Clear value proposition
        - Appropriate tone for the audience
        
        Format as JSON array with objects containing: day, subject, content, tone, cta
      `;

      const response = await openai.chat.completions.create({
        model: API_CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an outreach specialist who creates highly personalized, effective email sequences. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: API_CONFIG.openai.maxTokens,
        temperature: API_CONFIG.openai.temperature,
      });

      const content = response.choices[0].message.content;
      const messages = JSON.parse(content);
      
      return {
        id: Date.now(),
        ...sequenceData,
        messages: messages.map(msg => ({
          day: msg.day,
          subject: msg.subject,
          content: msg.content,
          tone: msg.tone || 'professional',
          cta: msg.cta || 'Reply to this email'
        })),
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      handleApiError(error, 'generate outreach sequence');
    }
  },

  /**
   * Chat with AI assistant
   */
  async chatWithAssistant(messages, context = {}) {
    try {
      const systemPrompt = `
        You are an AI business growth assistant for Diginer Plus. You help entrepreneurs and marketers with:
        - Business idea generation and validation
        - Marketing copy optimization
        - Outreach strategy development
        - Community insights and trends
        
        Be helpful, concise, and actionable in your responses.
        ${context.niche ? `The user is focused on the ${context.niche} niche.` : ''}
        ${context.targetAudience ? `Their target audience is ${context.targetAudience}.` : ''}
      `;

      const response = await openai.chat.completions.create({
        model: API_CONFIG.openai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: API_CONFIG.openai.maxTokens,
        temperature: API_CONFIG.openai.temperature,
      });

      return {
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      handleApiError(error, 'chat with assistant');
    }
  }
};

// Reddit API Services (for community insights)
export const redditService = {
  /**
   * Fetch trending topics from relevant subreddits
   */
  async getTrendingTopics(niche, limit = 10) {
    try {
      // Map niche to relevant subreddits
      const subredditMap = {
        'marketing': ['marketing', 'entrepreneur', 'smallbusiness'],
        'technology': ['technology', 'programming', 'startups'],
        'fitness': ['fitness', 'health', 'nutrition'],
        'finance': ['personalfinance', 'investing', 'entrepreneur'],
        'default': ['entrepreneur', 'business', 'startups']
      };

      const subreddits = subredditMap[niche.toLowerCase()] || subredditMap.default;
      const allPosts = [];

      for (const subreddit of subreddits) {
        try {
          const response = await fetch(
            `${API_CONFIG.reddit.baseUrl}/r/${subreddit}/hot.json?limit=${Math.ceil(limit / subreddits.length)}`,
            {
              headers: {
                'User-Agent': API_CONFIG.reddit.userAgent
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const posts = data.data.children.map(child => ({
              id: child.data.id,
              title: child.data.title,
              score: child.data.score,
              comments: child.data.num_comments,
              subreddit: child.data.subreddit,
              url: `https://reddit.com${child.data.permalink}`,
              created: new Date(child.data.created_utc * 1000).toISOString(),
              selftext: child.data.selftext?.substring(0, 200) + '...' || ''
            }));
            allPosts.push(...posts);
          }
        } catch (error) {
          console.warn(`Failed to fetch from r/${subreddit}:`, error);
        }
      }

      // Sort by score and return top posts
      return allPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      handleApiError(error, 'fetch trending topics');
    }
  },

  /**
   * Analyze sentiment of community discussions
   */
  async analyzeCommunitysentiment(posts) {
    try {
      const postsText = posts.map(post => `${post.title} ${post.selftext}`).join('\n\n');
      
      const prompt = `
        Analyze the sentiment and key themes from these community discussions:
        
        ${postsText}
        
        Provide:
        1. Overall sentiment (positive/negative/neutral)
        2. Key themes and topics (array)
        3. Trending concerns or opportunities
        4. Engagement indicators
        5. Actionable insights for businesses
        
        Format as JSON with: sentiment, themes, concerns, opportunities, insights
      `;

      const response = await openai.chat.completions.create({
        model: API_CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a community sentiment analyst who identifies trends and opportunities from social discussions. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: API_CONFIG.openai.maxTokens,
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      handleApiError(error, 'analyze community sentiment');
    }
  }
};

// Local Storage Service (for data persistence)
export const storageService = {
  /**
   * Save data to localStorage
   */
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  /**
   * Load data from localStorage
   */
  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove data from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  /**
   * Clear all app data
   */
  clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('diginer_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
};

// Export all services
export default {
  openai: openaiService,
  reddit: redditService,
  storage: storageService
};
