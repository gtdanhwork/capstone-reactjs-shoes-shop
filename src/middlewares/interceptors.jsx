import axios from 'axios';

// Updated Base URL from instructor's new documentation
export const http = axios.create({
	baseURL: 'https://apistore.cybersoft.edu.vn/api',
	timeout: 30000,
});

// Request Interceptor: Attach token if user is logged in
http.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor
http.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error),
);
