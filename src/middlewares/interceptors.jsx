import axios from 'axios';

export const http = axios.create({
	baseURL: 'https://apistore.cybersoft.edu.vn/api',
	timeout: 30000,
});

const isTokenExpired = (token) => {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.exp * 1000 < Date.now();
	} catch (e) {
		return true;
	}
};

http.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			if (isTokenExpired(token)) {
				// Token is expired, remove it immediately so request goes out as guest
				localStorage.removeItem('accessToken');
				localStorage.removeItem('userLogin');
			} else {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Clear expired credentials
			localStorage.removeItem('accessToken');
			localStorage.removeItem('userLogin');

			// Define pages that strictly require authentication
			const protectedRoutes = ['/profile', '/cart', '/checkout'];
			const currentPath = window.location.pathname;
			const isProtected = protectedRoutes.some((route) =>
				currentPath.startsWith(route),
			);
			if (isProtected && currentPath !== '/login') {
				alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	},
);
