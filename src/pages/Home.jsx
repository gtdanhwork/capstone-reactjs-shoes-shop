import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Link } from 'react-router-dom';

const Home = () => {
	const [arrProduct, setArrProduct] = useState([]);
	const [likedProducts, setLikedProducts] = useState({});
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await productService.getAllProducts();
				setArrProduct(data);
			} catch (error) {
				console.error('Lỗi khi tải danh sách sản phẩm:', error);
			}
		};
		fetchProducts();
	}, []);

	const toggleFavorite = (productId) => {
		setLikedProducts((prev) => ({
			...prev,
			[productId]: !prev[productId],
		}));
	};

	const carouselItems = arrProduct.slice(0, 3);

	const handlePrev = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? carouselItems.length - 1 : prev - 1,
		);
	};

	const handleNext = () => {
		setCurrentIndex((prev) =>
			prev === carouselItems.length - 1 ? 0 : prev + 1,
		);
	};

	return (
		<div className="home-page">
			{/* Carousel Section */}
			<section className="container my-4">
				<div className="position-relative px-md-5">
					<div className="carousel-inner home-carousel-inner bg-light border rounded-3 p-4 p-md-5 position-relative">
						{carouselItems.map((product, index) => {
							const isActive = index === currentIndex;
							return (
								<div
									key={product.id}
									className={`w-100 carousel-item-fade ${isActive ? 'active' : 'inactive'}`}
								>
									<div className="row align-items-center w-100 m-0">
										<div className="col-md-7 text-center mb-3 mb-md-0">
											<img
												src={product.image}
												alt={product.name}
												className="img-fluid carousel-img"
											/>
										</div>
										<div className="col-md-5 ps-md-4">
											<h2 className="fw-normal mb-3">
												{product.name}
											</h2>
											<p className="text-muted mb-4">
												{product.shortDescription}
											</p>
											<Link
												to={`/detail/${product.id}`}
												className="btn btn-warning text-white fw-bold px-4 py-2"
											>
												Buy now
											</Link>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Side Arrow Controllers */}
					<button
						className="carousel-control-prev border-0 bg-transparent position-absolute start-0 translate-middle-y top-50 ms-md-2 carousel-control-btn"
						type="button"
						onClick={handlePrev}
					>
						<span
							className="carousel-control-prev-icon bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center"
							aria-hidden="true"
						></span>
						<span className="visually-hidden">Previous</span>
					</button>

					<button
						className="carousel-control-next border-0 bg-transparent position-absolute end-0 translate-middle-y top-50 me-md-2 carousel-control-btn"
						type="button"
						onClick={handleNext}
					>
						<span
							className="carousel-control-next-icon bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center"
							aria-hidden="true"
						></span>
						<span className="visually-hidden">Next</span>
					</button>
				</div>
			</section>

			{/* Product Feature Heading */}
			<div className="container-fluid py-3 my-4">
				<div className="container">
					<h3 className="m-0 fw-bold text-white p-2 d-inline-block rounded product-feature-title">
						Product Feature
					</h3>
				</div>
			</div>

			{/* Product Feature Grid */}
			<section className="container mb-5">
				<div className="row g-4">
					{arrProduct.map((product) => {
						const isLiked = likedProducts[product.id];
						return (
							<div
								className="col-12 col-sm-6 col-lg-4"
								key={product.id}
							>
								<div className="card product-card h-100 shadow-sm border-0 position-relative p-3 bg-light">
									{/* Interactive Favorite Heart Icon */}
									<i
										className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'} heart-icon position-absolute top-0 end-0 m-3 fs-4`}
										onClick={() =>
											toggleFavorite(product.id)
										}
										title={
											isLiked
												? 'Đã thích'
												: 'Thêm vào yêu thích'
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
					})}
				</div>
			</section>
		</div>
	);
};

export default Home;
