import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import ProductItem from '../components/ProductItem';
import LoadingSpinner from '../components/LoadingSpinner';
import useRouting from '../customhooks/useRouting';
import EmptyState from '../components/EmptyState';

const Search = () => {
	const { searchParams, setSearchParams } = useRouting();
	const query = searchParams.get('keyword') || '';
	const categoryId = searchParams.get('categoryId') || '';

	const [keywordInput, setKeywordInput] = useState(query);
	const [selectedCategory, setSelectedCategory] = useState(categoryId);
	const [sortOrder, setSortOrder] = useState('default'); // 'asc', 'desc', 'default'

	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Pagination states
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize] = useState(8);
	const [totalItems, setTotalItems] = useState(0);

	// Fetch categories list on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const catData = await productService.getAllCategory();
				setCategories(catData || []);
			} catch (err) {
				console.error('Error loading categories:', err);
			}
		};
		fetchCategories();
	}, []);

	// Synchronize local input state when URL searchParams change
	useEffect(() => {
		setKeywordInput(query);
		setSelectedCategory(categoryId);
	}, [query, categoryId]);

	// Main data fetching logic based on URL params
	useEffect(() => {
		const fetchSearchData = async () => {
			setLoading(true);
			try {
				if (query) {
					const data = await productService.getProductByName(query);
					setProducts(data || []);
					setTotalItems(data?.length || 0);
				} else if (categoryId) {
					const data =
						await productService.getProductByCategory(categoryId);
					setProducts(data || []);
					setTotalItems(data?.length || 0);
				} else {
					const pagingData = await productService.getProductPaging(
						pageIndex,
						pageSize,
					);
					if (pagingData.items) {
						setProducts(pagingData.items);
						setTotalItems(
							pagingData.totalRow || pagingData.items.length,
						);
					} else {
						setProducts(pagingData || []);
						setTotalItems(pagingData?.length || 0);
					}
				}
			} catch (err) {
				console.error('Search error:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchSearchData();
	}, [query, categoryId, pageIndex, pageSize]);

	// Handle manual form submission
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		const params = {};
		if (keywordInput.trim()) params.keyword = keywordInput.trim();
		if (selectedCategory) params.categoryId = selectedCategory;

		setPageIndex(1);
		setSearchParams(params);
	};

	// Reset search filters
	const handleResetFilters = () => {
		setKeywordInput('');
		setSelectedCategory('');
		setSortOrder('default');
		setPageIndex(1);
		setSearchParams({});
	};

	// Process sorting on current product list
	const getSortedProducts = () => {
		const list = [...products];
		if (sortOrder === 'asc') {
			return list.sort((a, b) => a.price - b.price);
		}
		if (sortOrder === 'desc') {
			return list.sort((a, b) => b.price - a.price);
		}
		return list;
	};

	const displayedProducts = getSortedProducts();
	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPageIndex(newPage);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	return (
		<div className="container py-4">
			{/* Header Bar */}
			<div
				className="py-2 px-4 rounded text-white mb-4"
				style={{
					background:
						'linear-gradient(90deg, #8a2387, #e94057, #f27121)',
				}}
			>
				<h3 className="m-0 fw-bold">Search Products</h3>
			</div>

			{/* Interactive Search Controls Form */}
			<div className="bg-light p-4 rounded shadow-sm mb-4">
				<form onSubmit={handleSearchSubmit}>
					<div className="row g-3 align-items-end">
						{/* Search Input */}
						<div className="col-12 col-md-5">
							<label className="form-label fw-bold">
								Search Keyword
							</label>
							<div className="input-group">
								<span className="input-group-text bg-white">
									<i className="bi bi-search"></i>
								</span>
								<input
									type="text"
									className="form-control"
									placeholder="Enter product name (e.g. Nike, Adidas)..."
									value={keywordInput}
									onChange={(e) =>
										setKeywordInput(e.target.value)
									}
								/>
							</div>
						</div>

						{/* Category Filter */}
						<div className="col-12 col-sm-6 col-md-3">
							<label className="form-label fw-bold">
								Category
							</label>
							<select
								className="form-select"
								value={selectedCategory}
								onChange={(e) =>
									setSelectedCategory(e.target.value)
								}
							>
								<option value="">All Categories</option>
								{categories.map((cat) => (
									<option
										key={cat.id}
										value={cat.id}
									>
										{cat.category || cat.id}
									</option>
								))}
							</select>
						</div>

						{/* Price Sorting */}
						<div className="col-12 col-sm-6 col-md-2">
							<label className="form-label fw-bold">
								Sort Price
							</label>
							<select
								className="form-select"
								value={sortOrder}
								onChange={(e) => setSortOrder(e.target.value)}
							>
								<option value="default">Default</option>
								<option value="asc">Low to High</option>
								<option value="desc">High to Low</option>
							</select>
						</div>

						{/* Action Buttons */}
						<div className="col-12 col-md-2 d-flex gap-2">
							<button
								type="submit"
								className="btn btn-dark fw-bold w-100"
							>
								Search
							</button>
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={handleResetFilters}
								title="Reset filters"
							>
								Reset
							</button>
						</div>
					</div>
				</form>
			</div>

			{/* Results Subheading */}
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h5 className="fw-bold text-muted m-0">
					{query
						? `Results for "${query}"`
						: categoryId
							? `Category: ${categoryId}`
							: 'All Products'}
				</h5>
				<span className="badge bg-secondary">
					{displayedProducts.length} items found
				</span>
			</div>

			{/* Product List Grid */}
			{loading ? (
				<LoadingSpinner />
			) : displayedProducts.length === 0 ? (
				<EmptyState
					title="No products found"
					message="Try searching for a different keyword or category."
					actionText="Clear Filters"
					actionLink="/search"
				/>
			) : (
				<>
					<div className="row g-3 g-md-4 mb-4">
						{displayedProducts.map((item) => (
							<div
								key={item.id}
								className="col-12 col-sm-6 col-md-4 col-lg-3"
							>
								<ProductItem product={item} />
							</div>
						))}
					</div>

					{/* Pagination Bar (Only when viewing catalog without search/category active) */}
					{!query && !categoryId && totalPages > 1 && (
						<nav className="d-flex justify-content-center mt-4">
							<ul className="pagination">
								<li
									className={`page-item ${pageIndex === 1 ? 'disabled' : ''}`}
								>
									<button
										className="page-item btn btn-outline-dark me-1"
										onClick={() =>
											handlePageChange(pageIndex - 1)
										}
									>
										Previous
									</button>
								</li>
								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1,
								).map((num) => (
									<li
										key={num}
										className="page-item"
									>
										<button
											className={`btn me-1 ${pageIndex === num ? 'btn-dark fw-bold' : 'btn-outline-dark'}`}
											onClick={() =>
												handlePageChange(num)
											}
										>
											{num}
										</button>
									</li>
								))}
								<li
									className={`page-item ${pageIndex === totalPages ? 'disabled' : ''}`}
								>
									<button
										className="page-item btn btn-outline-dark"
										onClick={() =>
											handlePageChange(pageIndex + 1)
										}
									>
										Next
									</button>
								</li>
							</ul>
						</nav>
					)}
				</>
			)}
		</div>
	);
};

export default Search;
