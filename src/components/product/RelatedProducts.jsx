import { Link } from 'react-router-dom';

const RelatedProducts = ({ products = [] }) => (
	<div className="mt-5 pt-4 border-top">
		<div className="text-center mb-4">
			<h3 className="fw-bold py-2 px-4 d-inline-block rounded related-title">
				- Related Product -
			</h3>
		</div>

		<div className="row g-4">
			{products.map((product) => (
				<div
					className="col-12 col-sm-6 col-lg-4"
					key={product.id}
				>
					<div className="card h-100 shadow-sm border-0 p-3 bg-light">
						<div className="text-center py-3">
							<img
								src={product.image}
								alt={product.name}
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
									{product.name}
								</h5>
								<p className="card-text text-muted small">
									{product.shortDescription}
								</p>
							</div>
							<div className="d-flex mt-3">
								<Link
									to={`/detail/${product.id}`}
									className="btn btn-success fw-bold rounded-0 flex-grow-1 text-dark"
									style={{
										backgroundColor: '#93D551',
										borderColor: '#93D551',
									}}
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
			))}
		</div>
	</div>
);

export default RelatedProducts;
