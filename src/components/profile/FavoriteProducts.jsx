import { Link } from 'react-router-dom';

const FavoriteProducts = ({ favorites }) => {
	return (
		<div className="row g-3 g-md-4">
			{favorites.length === 0 ? (
				<p className="text-muted col-12">
					No favorite products saved.
				</p>
			) : (
				favorites.map((favorite, index) => {
					const product = favorite.product || favorite;
					const productId = product.id || product.productId || index;

					return (
						<div
							className="col-12 col-sm-6 col-md-4 col-lg-3"
							key={productId}
						>
							<div className="card h-100 shadow-sm border-0 p-3 bg-light text-center">
								<img
									src={product.image}
									alt={product.name}
									className="img-fluid mb-2 mx-auto"
									style={{
										height: '160px',
										objectFit: 'contain',
									}}
								/>
								<h5 className="fw-bold fs-6 text-truncate">
									{product.name}
								</h5>
								<Link
									to={`/detail/${product.id}`}
									className="btn btn-dark btn-sm fw-bold mt-auto"
								>
									View Product
								</Link>
							</div>
						</div>
					);
				})
			)}
		</div>
	);
};

export default FavoriteProducts;
