// services/apiService.js

// Import any necessary libraries or modules
import axios from 'axios';


const BASE_URL = 'https://api.example.com';


export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    // Handle errors appropriately (e.g., logging, error messages)
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Create a function to make a POST request to a specific endpoint
export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    // Handle errors appropriately (e.g., logging, error messages)
    console.error('Error posting data:', error);
    throw error;
  }
};

// Add more functions for other types of requests (PUT, DELETE, etc.) as needed
