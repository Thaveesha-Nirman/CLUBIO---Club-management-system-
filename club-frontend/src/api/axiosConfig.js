import axios from 'axios';
/**
 * *Memnber 01 : feature/auth-fullstack-36682
 * * centralized Axios configuration to handle backend connectivity.
 */
const api = axios.create({
  // Aligning frintend requests with the API versioning verified in the postman
  baseURL: 'http://localhost:8080/api/v1', 
  // Ensures cookies and session data are  handled correctly across origins 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;