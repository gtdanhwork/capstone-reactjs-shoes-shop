import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import ProductGrid from '../components/product/ProductGrid';

const Home = () => {
	const [arrProduct, setArrProduct] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const data = await productService.getAllProducts();
				setArrProduct(data);
			} catch (error) {
				console.error('Lỗi khi tải danh sách sản phẩm:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

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
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentProducts = arrProduct.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(arrProduct.length / itemsPerPage);

	if (loading) {
		return <LoadingSpinner message="Đang tải danh sách sản phẩm..." />;
	}

	return (
		<div className="home-page">
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

			<div className="container py-4">
				<h2 className="fw-bold text-center mb-4">Product Feature</h2>
				<ProductGrid products={currentProducts} />

				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>
		</div>
	);
};

export default Home;
