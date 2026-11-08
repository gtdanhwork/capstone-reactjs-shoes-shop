import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
	title = 'No items found',
	message = 'Check back later or try a different filter.',
	actionText = 'Back to Home',
	actionLink = '/',
}) => {
	return (
		<div className="text-center py-5 bg-light rounded shadow-sm p-4 my-3">
			<i className="bi bi-box-seam fs-1 text-muted mb-3 d-block"></i>
			<h4 className="fw-bold">{title}</h4>
			<p className="text-muted mb-4">{message}</p>
			{actionLink && (
				<Link
					to={actionLink}
					className="btn btn-dark fw-bold px-4"
				>
					{actionText}
				</Link>
			)}
		</div>
	);
};

export default EmptyState;
