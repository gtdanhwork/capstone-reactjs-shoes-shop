import { useEffect, useMemo, useState } from 'react';
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import useRouting from '../customhooks/useRouting';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import SearchFilters from '../components/SearchFilters';
import PageTitle from '../components/PageTitle';
import ProductGrid from '../components/product/ProductGrid';

const ITEMS_PER_PAGE = 8;

const Search = () => {
	const { searchParams, setSearchParams } = useRouting();
	const query = searchParams.get('keyword') || '';
	const categoryId = searchParams.get('categoryId') || '';

	const [sortOrder, setSortOrder] = useState('default');

	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const [pageState, setPageState] = useState({ filterKey: '', page: 1 });
	const [totalItems, setTotalItems] = useState(0);
	const filterKey = JSON.stringify([query, categoryId]);
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
	const currentPage =
		pageState.filterKey === filterKey
			? Math.min(pageState.page, totalPages)
			: 1;

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const catData = await productService.getAllCategory();
				setCategories(catData || []);
			} catch (err) {
				console.error('Error loading categories:', err);
				setCategories([]);
			}
		};
		fetchCategories();
	}, []);

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
						currentPage,
						ITEMS_PER_PAGE,
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
				setProducts([]);
				setTotalItems(0);
			} finally {
				setLoading(false);
			}
		};

		fetchSearchData();
	}, [query, categoryId, currentPage]);

	const handleSearchSubmit = ({ keyword, categoryId: selectedCategory }) => {
		const params = {};
		if (keyword) params.keyword = keyword;
		if (selectedCategory) params.categoryId = selectedCategory;

		setSearchParams(params);
	};

	const handleResetFilters = () => {
		setSortOrder('default');
		setSearchParams({});
	};

	const displayedProducts = useMemo(() => {
		if (sortOrder === 'default') return products;

		const direction = sortOrder === 'asc' ? 1 : -1;
		return [...products].sort(
			(a, b) => direction * (a.price - b.price),
		);
	}, [products, sortOrder]);
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPageState({ filterKey, page: newPage });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	return (
		<div className="container py-4">
			<PageTitle>Search Products</PageTitle>

			<SearchFilters
				key={filterKey}
				categories={categories}
				keyword={query}
				selectedCategory={categoryId}
				sortOrder={sortOrder}
				onSortChange={setSortOrder}
				onSubmit={handleSearchSubmit}
				onReset={handleResetFilters}
			/>

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
					<ProductGrid
						products={displayedProducts}
						className="row g-3 g-md-4 mb-4"
					/>

					{!query && !categoryId && totalPages > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default Search;
