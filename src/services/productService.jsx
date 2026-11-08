import { http } from '../middlewares/interceptors';

export const productService = {
	getAllProducts: async (keyword = '') => {
		try {
			const url = keyword ? `/Product?keyword=${keyword}` : '/Product';
			const response = await http.get(url);
			return response.data.content;
		} catch (error) {
			console.error('Error fetching products:', error);
			throw error;
		}
	},

	getProductById: async (id) => {
		try {
			const response = await http.get(`/Product/getbyid?id=${id}`);
			return response.data.content;
		} catch (error) {
			console.error(`Error fetching product ID ${id}:`, error);
			throw error;
		}
	},

	getAllCategory: async () => {
		try {
			const response = await http.get('/Product/getAllCategory');
			return response.data.content;
		} catch (error) {
			console.error('Error fetching categories:', error);
			throw error;
		}
	},

	getProductByCategory: async (categoryId) => {
		try {
			const response = await http.get(
				`/Product/getProductByCategory?categoryId=${categoryId}`,
			);
			return response.data.content;
		} catch (error) {
			console.error(`Error fetching category ${categoryId}:`, error);
			throw error;
		}
	},
};
