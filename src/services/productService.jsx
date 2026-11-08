import { http } from '../middlewares/interceptors';

export const productService = {
	// Get all products
	getAllProducts: async () => {
		try {
			const response = await http.get('/Product');
			return response.data.content;
		} catch (error) {
			console.error('Error fetching all products:', error);
			throw error;
		}
	},

	// Get product by ID (Detail page)
	getProductById: async (id) => {
		try {
			const response = await http.get(`/Product/getbyid?id=${id}`);
			return response.data.content;
		} catch (error) {
			console.error(`Error fetching product ID ${id}:`, error);
			throw error;
		}
	},

	// Search product by keyword name
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

	// Get all categories for header navigation & search filters
	getAllCategory: async () => {
		try {
			const response = await http.get('/Product/getAllCategory');
			return response.data.content;
		} catch (error) {
			console.error('Error fetching categories:', error);
			throw error;
		}
	},

	// Filter products by Category ID
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

	// Get paginated product list
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
