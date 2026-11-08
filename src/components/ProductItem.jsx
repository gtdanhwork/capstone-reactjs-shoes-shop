import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import useRouting from '../customhooks/useRouting';

const ProductItem = ({ product, initialLiked = false, onToggleSuccess }) => {
	const navigate = useRouting();
	const [isLiked, setIsLiked] = useState(initialLiked);
	const [loading, setLoading] = useState(false);

	const handleToggleFavorite = async (e) => {
		e.preventDefault();

		const token = localStorage.getItem('accessToken');
		if (!token) {
			alert('Vui lòng đăng nhập để thêm sản phẩm yêu thích!');
			navigate('/login');
			return;
		}

		try {
			setLoading(true);
			if (isLiked) {
				await userService.unlikeProduct(product.id);
				setIsLiked(false);
			} else {
				await userService.likeProduct(product.id);
				setIsLiked(true);
			}

			if (onToggleSuccess) onToggleSuccess();
		} catch (err) {
			alert(
				err.response?.data?.message ||
					'Có lỗi xảy ra khi cập nhật yêu thích!',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="card h-100 border-0 shadow-sm p-3 text-center position-relative">
			{/* Heart Icon Button */}
			<button
				className="btn btn-link position-absolute top-0 end-0 p-2 text-danger border-0 shadow-none"
				onClick={handleToggleFavorite}
				disabled={loading}
				title={isLiked ? 'Unlike' : 'Like'}
			>
				<i
					className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} fs-5`}
				></i>
			</button>

			<img
				src={product.image}
				alt={product.name}
				className="img-fluid mb-3 mx-auto"
				style={{ maxHeight: '180px', objectFit: 'contain' }}
			/>
			<h5 className="card-title fw-bold fs-6 text-truncate">
				{product.name}
			</h5>
			<p className="card-text text-muted small text-truncate">
				{product.shortDescription}
			</p>

			<div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
				<span className="fw-bold text-danger">{product.price}$</span>
				<Link
					to={`/detail/${product.id}`}
					className="btn btn-dark btn-sm fw-bold"
				>
					Buy now
				</Link>
			</div>
		</div>
	);
};

export default ProductItem;
