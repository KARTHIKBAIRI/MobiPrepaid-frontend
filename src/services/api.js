import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginAdmin = (credentials) =>
    api.post('/admin/login', credentials).then((res) => res.data);

export const getExpiringSubscribers = () =>
    api.get('/admin/subscribers/expiring').then((res) => res.data);

export const getRechargeHistory = (mobileNumber) =>
    api.get(`/admin/subscribers/${mobileNumber}/history`).then((res) => res.data);

export const registerUser = (data) =>
    api.post('/recharge/register', data).then((res) => res.data);

export const validateMobile = (data) =>
    api.post('/recharge/validate', data).then((res) => res.data);

export const getPlans = () =>
    api.get('/recharge/plans').then((res) => res.data);

export const submitRecharge = (data) =>
    api.post('/recharge', data).then((res) => res.data);

export const processPayment = (data) =>
    api.post('/recharge/payment', data).then((res) => res.data);

export default api;