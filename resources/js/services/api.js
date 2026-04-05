import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
});

// Interceptor para logging (útil para debug)
api.interceptors.request.use(request => {
    console.log(`API Request: ${request.method?.toUpperCase()} ${request.url}`, request.data);
    return request;
});

api.interceptors.response.use(
    response => {
        console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
        return response;
    },
    error => {
        console.error(`API Error:`, error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
