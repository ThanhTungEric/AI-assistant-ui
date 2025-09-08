// config/axios.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/chat';
//const BASE_URL = 'https://portal.vgu.edu.vn/chat';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
