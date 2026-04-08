import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'https://crud-ranhentos-idiomas.onrender.com/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 60000, //60 segundos
});
export default api;
