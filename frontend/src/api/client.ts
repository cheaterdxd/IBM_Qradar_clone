import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data: { username: string; password: string; full_name?: string; email?: string }) =>
        api.post('/auth/register', data),
    login: (data: { username: string; password: string }) =>
        api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
};

// Rules API
export const rulesAPI = {
    list: () => api.get('/rules'),
    get: (id: string) => api.get(`/rules/${id}`),
    create: (data: any) => api.post('/rules', data),
    update: (id: string, data: any) => api.put(`/rules/${id}`, data),
    delete: (id: string) => api.delete(`/rules/${id}`),
};

// Building Blocks API
export const buildingBlocksAPI = {
    list: () => api.get('/building-blocks'),
    get: (id: string) => api.get(`/building-blocks/${id}`),
    create: (data: any) => api.post('/building-blocks', data),
    update: (id: string, data: any) => api.put(`/building-blocks/${id}`, data),
    delete: (id: string) => api.delete(`/building-blocks/${id}`),
};

// Test API
export const testAPI = {
    validateSyntax: (aql: string) => api.post('/test/validate-syntax', { aql }),
    testRule: (data: any) => api.post('/test/test-rule', data),
};

export default api;
