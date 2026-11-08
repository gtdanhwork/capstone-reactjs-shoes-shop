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

	facebookLogin: async (data) => {
		const response = await http.post('/Users/facebooklogin', data);
		return response.data;
	},

	// Get user profile details
	getProfile: async () => {
		try {
			const response = await http.post('/Users/getProfileV2');
			return response.data.content;
		} catch (error) {
			console.error('Error fetching profile:', error);
			throw error;
		}
	},

	// Update user profile info
	updateProfile: async (profileData) => {
		try {
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

	// Get favorite products list
	getFavoriteProducts: async () => {
		try {
			const response = await http.get('/Users/getproductfavorite');
			return response.data.content;
		} catch (error) {
			console.error('Error fetching favorites:', error);
			throw error;
		}
	},
};
