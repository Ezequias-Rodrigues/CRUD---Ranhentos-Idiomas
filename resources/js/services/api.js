import axios from 'axios';
const isProduction = import.meta.env.PROD; //Ver se estamos em ambiente de produção ou ñ
const API_URL = isProduction
    ? import.meta.env.VITE_API_URL || 'https://crud-ranhentos-idiomas.onrender.com/api'  : '/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, //30 segundos
});
export default api;
