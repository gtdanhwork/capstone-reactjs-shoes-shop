import { http } from '../middlewares/interceptors';

export const userService = {
	signup: async (userData) => {
		const response = await http.post('/Users/signup', userData);
		return response.data;
	},

	signin: async (credentials) => {
		const response = await http.post('/Users/signin', credentials);
		return response.data;
	},

	getProfile: async () => {
		try {
			const response = await http.post('/Users/getProfileV2');
			return response.data.content;
		} catch (error) {
			console.error('Error fetching profile:', error);
			throw error;
		}
	},

	updateProfile: async (profileData) => {
		try {
			// profileData can include email, name, phone, gender, password, avatar
			const response = await http.post(
				'/Users/updateProfile',
				profileData,
			);
			return response.data;
		} catch (error) {
			console.error('Error updating profile:', error);
			throw error;
		}
	},

	getFavoriteProducts: async () => {
		try {
			const response = await http.get('/Users/getproductfavorite');
			console.log('Favorite API Raw Data:', response.data); // Inspect this in browser console

			const content = response.data?.content;

			// Handle all possible backend response structures
			if (Array.isArray(content)) {
				return content;
			}
			if (Array.isArray(response.data)) {
				return response.data;
			}
			if (
				content?.productsFavorite &&
				Array.isArray(content.productsFavorite)
			) {
				return content.productsFavorite;
			}
			if (content?.products && Array.isArray(content.products)) {
				return content.products;
			}

			return [];
		} catch (error) {
			console.error('Error fetching favorites:', error);
			return [];
		}
	},
	// Like a product (GET /api/Users/like?productId=...)
	likeProduct: async (productId) => {
		try {
			const response = await http.get(
				`/Users/like?productId=${productId}`,
			);
			return response.data;
		} catch (error) {
			console.error('Error liking product:', error);
			throw error;
		}
	},

	// Unlike a product (GET /api/Users/unlike?productId=...)
	unlikeProduct: async (productId) => {
		try {
			const response = await http.get(
				`/Users/unlike?productId=${productId}`,
			);
			return response.data;
		} catch (error) {
			console.error('Error unliking product:', error);
			throw error;
		}
	},
};
