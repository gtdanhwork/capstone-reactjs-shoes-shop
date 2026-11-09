import { useState } from 'react';

const SearchFilters = ({
	categories,
	keyword,
	selectedCategory,
	sortOrder,
	onSortChange,
	onSubmit,
	onReset,
}) => {
	const [keywordInput, setKeywordInput] = useState(keyword);
	const [categoryInput, setCategoryInput] = useState(selectedCategory);

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit({
			keyword: keywordInput.trim(),
			categoryId: categoryInput,
		});
	};

	const handleReset = () => {
		setKeywordInput('');
		setCategoryInput('');
		onReset();
	};

	return (
		<div className="bg-light p-4 rounded shadow-sm mb-4">
			<form onSubmit={handleSubmit}>
				<div className="row g-3 align-items-end">
					<div className="col-12 col-md-5">
						<label
							className="form-label fw-bold"
							htmlFor="search-keyword"
						>
							Search Keyword
						</label>
						<div className="input-group">
							<span className="input-group-text bg-white">
								<i className="bi bi-search"></i>
							</span>
							<input
								id="search-keyword"
								type="text"
								className="form-control"
								placeholder="Enter product name (e.g. Nike, Adidas)..."
								value={keywordInput}
								onChange={(event) =>
									setKeywordInput(event.target.value)
								}
							/>
						</div>
					</div>

					<div className="col-12 col-sm-6 col-md-3">
						<label
							className="form-label fw-bold"
							htmlFor="search-category"
						>
							Category
						</label>
						<select
							id="search-category"
							className="form-select"
							value={categoryInput}
							onChange={(event) =>
								setCategoryInput(event.target.value)
							}
						>
							<option value="">All Categories</option>
							{categories.map((category) => (
								<option
									key={category.id}
									value={category.id}
								>
									{category.category || category.id}
								</option>
							))}
						</select>
					</div>

					<div className="col-12 col-sm-6 col-md-2">
						<label
							className="form-label fw-bold"
							htmlFor="search-sort"
						>
							Sort Price
						</label>
						<select
							id="search-sort"
							className="form-select"
							value={sortOrder}
							onChange={(event) =>
								onSortChange(event.target.value)
							}
						>
							<option value="default">Default</option>
							<option value="asc">Low to High</option>
							<option value="desc">High to Low</option>
						</select>
					</div>

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
							onClick={handleReset}
							title="Reset filters"
						>
							Reset
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SearchFilters;
