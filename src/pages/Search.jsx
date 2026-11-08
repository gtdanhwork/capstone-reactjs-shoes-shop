import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import _ from 'lodash';

const Search = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const keywordParam = searchParams.get('keyword') || '';

	const [keyword, setKeyword] = useState(keywordParam);
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [sortOrder, setSortOrder] = useState(''); // 'asc' or 'desc'
	const [likedProducts, setLikedProducts] = useState({});

	// Fetch categories on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const catData = await productService.getAllCategory();
				setCategories(catData);
			} catch (error) {
				console.error('Error loading categories:', error);
			}
		};
		fetchCategories();
	}, []);

	// Fetch products based on keyword or category selection
	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				let data = [];
				if (selectedCategory) {
					data =
						await productService.getProductByCategory(
							selectedCategory,
						);
				} else {
					data = await productService.getAllProducts(keywordParam);
				}
				setProducts(data);
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		};

		fetchSearchResults();
	}, [keywordParam, selectedCategory]);

	// Handle Search Form Submit
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setSelectedCategory(''); // Reset category filter on text search
		if (keyword.trim()) {
			setSearchParams({ keyword: keyword.trim() });
		} else {
			setSearchParams({});
		}
	};

	// Handle Sort using Lodash
	const handleSortChange = (e) => {
		const order = e.target.value;
		setSortOrder(order);

		if (order) {
			const sorted = _.orderBy(products, ['price'], [order]);
			setProducts(sorted);
		}
	};

	const toggleFavorite = (productId) => {
		setLikedProducts((prev) => ({
			...prev,
			[productId]: !prev[productId],
		}));
	};

	return (
		<div className="search-page py-4">
			<div className="container">
				{/* Search Box Form */}
				<div className="bg-light p-4 rounded-3 shadow-sm mb-4">
					<h4 className="fw-bold mb-3">Search</h4>
					<form
						onSubmit={handleSearchSubmit}
						className="row g-3"
					>
						<div className="col-md-9">
							<input
								type="text"
								className="form-control"
								placeholder="product name..."
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
							/>
						</div>
						<div className="col-md-3">
							<button
								type="submit"
								className="btn btn-primary w-100 fw-bold"
								style={{
									backgroundColor: '#6f42c1',
									borderColor: '#6f42c1',
								}}
							>
								SEARCH
							</button>
						</div>
					</form>

					{/* Optional Category Filter */}
					<div className="row mt-3">
						<div className="col-md-4">
							<select
								className="form-select"
								value={selectedCategory}
								onChange={(e) => {
									setSelectedCategory(e.target.value);
									setSearchParams({}); // Clear keyword search if category is selected
								}}
							>
								<option value="">All Categories</option>
								{categories.map((cat) => (
									<option
										key={cat.id}
										value={cat.id}
									>
										{cat.category}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Search Result Header */}
				<div className="container-fluid py-2 mb-4 search-title-bar rounded text-white">
					<h3 className="m-0 fw-bold">Search result</h3>
				</div>

				{/* Price Sorting Filter */}
				<div className="row mb-4">
					<div className="col-md-3">
						<label className="form-label fw-bold text-muted small">
							Price
						</label>
						<select
							className="form-select"
							value={sortOrder}
							onChange={handleSortChange}
						>
							<option value="">-- Sort by price --</option>
							<option value="asc">Ascending (Low to High)</option>
							<option value="desc">Decrease (High to Low)</option>
						</select>
					</div>
				</div>

				{/* Product Grid */}
				<div className="row g-4">
					{products.length === 0 ? (
						<div className="col-12 text-center py-5 text-muted">
							No products found matching your search.
						</div>
					) : (
						products.map((product) => {
							const isLiked = likedProducts[product.id];
							return (
								<div
									className="col-12 col-sm-6 col-lg-4"
									key={product.id}
								>
									<div className="card search-card h-100 shadow-sm border-0 position-relative p-3 bg-light">
										{/* Favorite Heart Icon */}
										<i
											className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'} position-absolute top-0 end-0 m-3 fs-4`}
											style={{
												cursor: 'pointer',
												zIndex: 2,
											}}
											onClick={() =>
												toggleFavorite(product.id)
											}
										></i>

										<div className="text-center py-3">
											<img
												src={product.image}
												alt={product.name}
												className="img-fluid product-img"
											/>
										</div>

										<div className="card-body d-flex flex-column justify-content-between px-0 pb-0">
											<div>
												<h5 className="card-title fw-bold text-dark">
													{product.name}
												</h5>
												<p className="card-text text-muted small">
													{product.shortDescription}
												</p>
											</div>

											<div className="d-flex mt-3">
												<Link
													to={`/detail/${product.id}`}
													className="btn btn-buy rounded-0 flex-grow-1"
												>
													Buy now
												</Link>
												<div className="bg-secondary bg-opacity-10 text-dark fw-bold d-flex align-items-center justify-content-center px-3 rounded-0">
													{product.price}$
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};

export default Search;
