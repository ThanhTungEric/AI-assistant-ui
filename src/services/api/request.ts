import api from '../config/axios';

export default async function request<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any
): Promise<T> {
  try {
    const response = await api({ url: path, method, data });
    return response.data;
  } catch (error: any) {
    console.error('Axios Error Message:', error.message);
    if (error.response) {
      console.error('Server responded with:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Request was made but no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
}
