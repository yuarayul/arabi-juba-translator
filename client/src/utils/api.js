// src/utils/api.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

console.log("API URL configured as:", API_URL);

export default API_URL;