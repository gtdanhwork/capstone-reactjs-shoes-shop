import { http } from '../middlewares/interceptors';

export const productService = {
	getAllProducts: async () => {
		try {
			const response = await http.get('/Product');
			return response.data.content;
		} catch (error) {
			console.error('Error fetching all products:', error);
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

	getProductByName: async (keyword) => {
		try {
			const response = await http.get(`/Product?keyword=${keyword}`);
			return response.data.content;
		} catch (error) {
			console.error(
				`Error searching product by keyword "${keyword}":`,
				error,
			);
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
			console.error(
				`Error fetching products by category "${categoryId}":`,
				error,
			);
			throw error;
		}
	},

	getProductPaging: async (pageIndex = 1, pageSize = 8) => {
		try {
			const response = await http.get(
				`/Product/getpaging?pageIndex=${pageIndex}&pageSize=${pageSize}`,
			);
			return response.data.content;
		} catch (error) {
			console.error('Error fetching paginated products:', error);
			throw error;
		}
	},
};
