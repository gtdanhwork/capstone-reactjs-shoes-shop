import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/authSlice';

export const http = axios.create({
	baseURL: 'https://apistore.cybersoft.edu.vn/api',
	timeout: 30000,
});

const isTokenExpired = (token) => {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.exp * 1000 < Date.now();
	} catch {
		return true;
	}
};

http.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			if (isTokenExpired(token)) {
				store.dispatch(logout());
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
			store.dispatch(logout());

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
