import axios from 'axios';

const api = axios.create({
  baseURL: 'https://enoteca-backend.onrender.com'
});

export default api;