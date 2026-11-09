const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
	const compactPages =
		totalPages <= 5
			? pages
			: currentPage <= 2
				? [1, 2, 'ellipsis', totalPages]
				: currentPage >= totalPages - 1
					? [1, 'ellipsis', totalPages - 1, totalPages]
					: [1, 'ellipsis-before', currentPage, 'ellipsis-after', totalPages];

	const renderPageItems = (pageList) =>
		pageList.map((page) =>
			typeof page === 'number' ? (
				<li
					key={page}
					className={`page-item ${currentPage === page ? 'active' : ''}`}
				>
					<button
						type="button"
						className="page-link"
						onClick={() => onPageChange(page)}
						aria-current={currentPage === page ? 'page' : undefined}
					>
						{page}
					</button>
				</li>
			) : (
				<li key={page} className="page-item disabled" aria-hidden="true">
					<span className="page-link">…</span>
				</li>
			),
		);

	return (
		<nav
			aria-label="Page navigation"
			className="my-4"
		>
			<ul className="pagination justify-content-center d-none d-sm-flex">
				{/* Previous Button */}
				<li
					className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
				>
					<button
						type="button"
						className="page-link"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</button>
				</li>

				{renderPageItems(pages)}

				<li
					className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
				>
					<button
						type="button"
						className="page-link"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</li>
			</ul>

			<ul className="pagination justify-content-center d-flex d-sm-none">
				<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
					<button
						type="button"
						className="page-link"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						aria-label="Previous page"
					>
						&lsaquo;
					</button>
				</li>

				{renderPageItems(compactPages)}

				<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
					<button
						type="button"
						className="page-link"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						aria-label="Next page"
					>
						&rsaquo;
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
