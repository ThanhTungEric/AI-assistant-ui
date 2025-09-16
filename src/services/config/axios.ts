import axios from 'axios';

const BASE_URL = 'http://localhost:3001/chat';
//const BASE_URL = 'https://aichat.vgu.edu.vn/chat';
// const BASE_URL = 'https://portal.vgu.edu.vn/chat';

interface RefreshResponse {
  accessToken: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && config.headers) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<RefreshResponse>(
          `${BASE_URL}/users/auth/refresh`,
          {},
          { withCredentials: true }
        );

        localStorage.setItem('accessToken', data.accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        window.location.href = '/ai-assistant/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
