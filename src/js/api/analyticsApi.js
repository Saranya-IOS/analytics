const API_URL = 'http://localhost:8000/api';

export class AnalyticsApi {
  // Fetch dashboard data
  static async getDashboardData() {
    try {
      const response = await fetch(`${API_URL}/dashboard`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
  
  // Fetch events with optional filtering
  static async getEvents({ limit, offset, eventType }) {
    try {
      const query = {};
      if (eventType) {
        query.event_type = eventType;
      }
   
      const response = await fetch(`/api/events?limit=${limit}&offset=${offset}&eventType=${eventType}`);
      const data = await response.json();
   
      return {
        events: Array.isArray(data.events) ? data.events : [],   // Ensure it's always an array
        total: typeof data.total === 'number' ? data.total : 0   // Ensure it's always a number
      };
    } catch (err) {
      console.error("Error fetching events:", err);
      return {
        events: [],
        total: 0
      };
    }
  }
  
  // Track a new event
  static async trackEvent(eventData) {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to track event');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }
  
  // Fetch users
  static async getUsers(options = {}) {
    const { limit = 100, offset = 0 } = options;
    const url = `${API_URL}/users?limit=${limit}&offset=${offset}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  
  // Fetch funnel data
  static async getFunnelData(steps = ['page_view', 'signup', 'purchase']) {
    const stepsParam = steps.join(',');
    const url = `${API_URL}/funnel?steps=${stepsParam}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch funnel data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching funnel data:', error);
      throw error;
    }
  }

  
}