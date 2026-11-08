import axios from 'axios';

export const http = axios.create({
	baseURL: 'https://apistore.cybersoft.edu.vn/api',
	timeout: 30000,
});

// 1. Request Interceptor: Attaches the Bearer token to outgoing headers
http.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// 2. Response Interceptor: Catches 401 Unauthorized when tokens expire
http.interceptors.response.use(
	(response) => {
		// Return successful responses directly
		return response;
	},
	(error) => {
		// Check if error response exists and status is 401 (Unauthorized)
		if (error.response && error.response.status === 401) {
			// Clear expired tokens or user states from storage
			localStorage.removeItem('accessToken');
			localStorage.removeItem('userLogin'); // Clear any stored user profile data

			// Redirect user to login page if they aren't already there
			if (window.location.pathname !== '/login') {
				alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	},
);
