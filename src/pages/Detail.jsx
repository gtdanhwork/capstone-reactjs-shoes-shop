import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';

import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Detail = () => {
	const { id } = useParams(); // Get product id from URL route: /detail/:id
	const [product, setProduct] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchProductDetail = async () => {
			try {
				const data = await productService.getProductById(id);
				setProduct(data);
				// Set default selected size to the first available size if exists
				if (data && data.size && data.size.length > 0) {
					setSelectedSize(data.size[0]);
				}
			} catch (error) {
				console.error('Error fetching product detail:', error);
			}
		};

		if (id) {
			fetchProductDetail();
		}
		window.scrollTo(0, 0);
	}, [id]);

	if (!product) {
		return (
			<div className="container py-5 text-center">
				<div
					className="spinner-border text-primary"
					role="status"
				>
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	const handleAddToCart = () => {
		dispatch(
			addToCart({
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image,
				size: selectedSize,
				quantity: quantity,
			}),
		);
		alert(
			`Đã thêm ${quantity} sản phẩm ${product.name} (Size: ${selectedSize}) vào giỏ hàng!`,
		);
	};

	return (
		<div className="detail-page py-4">
			<div className="container">
				<div className="row align-items-center mb-5">
					<div className="col-lg-5 text-center mb-4 mb-lg-0">
						<div className="p-4 bg-light border rounded-3 shadow-sm">
							<img
								src={product.image}
								alt={product.name}
								className="img-fluid product-detail-img"
							/>
						</div>
					</div>

					{/* Product Info & Actions */}
					<div className="col-lg-7">
						<h1 className="fw-bold mb-3">{product.name}</h1>
						<p className="text-muted">{product.description}</p>

						<h3 className="text-danger fw-bold mb-4">
							{product.price}$
						</h3>
						<div className="mb-4">
							<h6 className="fw-bold mb-2">Available size</h6>
							<div className="d-flex flex-wrap gap-2">
								{product.size?.map((sizeItem) => (
									<button
										key={sizeItem}
										type="button"
										className={`size-btn rounded ${selectedSize === sizeItem ? 'active' : ''}`}
										onClick={() =>
											setSelectedSize(sizeItem)
										}
									>
										{sizeItem}
									</button>
								))}
							</div>
						</div>
						<div className="d-flex align-items-center gap-3 mb-4">
							<div className="quantity-control d-flex align-items-center">
								<button
									onClick={() =>
										setQuantity((prev) =>
											prev > 1 ? prev - 1 : 1,
										)
									}
								>
									-
								</button>
								<span>{quantity}</span>
								<button
									onClick={() =>
										setQuantity((prev) => prev + 1)
									}
								>
									+
								</button>
							</div>

							<button
								className="btn btn-add-cart px-4 py-2 rounded-2"
								onClick={handleAddToCart}
							>
								Add to cart
							</button>
						</div>
					</div>
				</div>
				<div className="mt-5 pt-4 border-top">
					<div className="text-center mb-4">
						<h3 className="fw-bold py-2 px-4 d-inline-block rounded related-title">
							- Related Product -
						</h3>
					</div>

					<div className="row g-4">
						{product.relatedProducts?.map((item) => (
							<div
								className="col-12 col-sm-6 col-lg-4"
								key={item.id}
							>
								<div className="card h-100 shadow-sm border-0 p-3 bg-light">
									<div className="text-center py-3">
										<img
											src={item.image}
											alt={item.name}
											className="img-fluid"
											style={{
												height: '180px',
												objectFit: 'contain',
											}}
										/>
									</div>
									<div className="card-body d-flex flex-column justify-content-between px-0 pb-0">
										<div>
											<h5 className="card-title fw-bold text-dark">
												{item.name}
											</h5>
											<p className="card-text text-muted small">
												{item.shortDescription}
											</p>
										</div>

										<div className="d-flex mt-3">
											<Link
												to={`/detail/${item.id}`}
												className="btn btn-success fw-bold rounded-0 flex-grow-1 text-dark"
												style={{
													backgroundColor: '#93D551',
													borderColor: '#93D551',
												}}
											>
												Buy now
											</Link>
											<div className="bg-secondary bg-opacity-10 text-dark fw-bold d-flex align-items-center justify-content-center px-3 rounded-0">
												{item.price}$
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Detail;
