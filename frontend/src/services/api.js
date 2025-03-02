import axios from 'axios';

const API_URL = '/api';

// Person API endpoints
export const personApi = {
  // Get all persons
  getAllPersons: async () => {
    const response = await axios.get(`${API_URL}/persons/`);
    return response.data;
  },
  
  // Get organization tree
  getOrgTree: async () => {
    const response = await axios.get(`${API_URL}/persons/tree`);
    return response.data;
  },
  
  // Get a specific person
  getPerson: async (personId) => {
    const response = await axios.get(`${API_URL}/persons/${personId}`);
    return response.data;
  },
  
  // Create a new person
  createPerson: async (personData) => {
    const response = await axios.post(`${API_URL}/persons/`, personData);
    return response.data;
  },
  
  // Update a person
  updatePerson: async (personId, personData) => {
    const response = await axios.put(`${API_URL}/persons/${personId}`, personData);
    return response.data;
  },
  
  // Delete a person
  deletePerson: async (personId) => {
    const response = await axios.delete(`${API_URL}/persons/${personId}`);
    return response.data;
  },
  
  // Get subordinates of a person
  getSubordinates: async (personId) => {
    const response = await axios.get(`${API_URL}/persons/${personId}/subordinates`);
    return response.data;
  }
};

// Goal API endpoints
export const goalApi = {
  // Get all goals
  getAllGoals: async () => {
    const response = await axios.get(`${API_URL}/goals/`);
    return response.data;
  },
  
  // Get a specific goal
  getGoal: async (goalId) => {
    const response = await axios.get(`${API_URL}/goals/${goalId}`);
    return response.data;
  },
  
  // Get goals for a specific person
  getPersonGoals: async (personId) => {
    const response = await axios.get(`${API_URL}/goals/person/${personId}`);
    return response.data;
  },
  
  // Get goals from the parent of a specific person
  getParentGoals: async (personId) => {
    const response = await axios.get(`${API_URL}/goals/parent/${personId}`);
    return response.data;
  },
  
  // Create a new goal
  createGoal: async (goalData) => {
    const response = await axios.post(`${API_URL}/goals/`, goalData);
    return response.data;
  },
  
  // Update a goal
  updateGoal: async (goalId, goalData) => {
    const response = await axios.put(`${API_URL}/goals/${goalId}`, goalData);
    return response.data;
  },
  
  // Delete a goal
  deleteGoal: async (goalId) => {
    const response = await axios.delete(`${API_URL}/goals/${goalId}`);
    return response.data;
  }
}; 