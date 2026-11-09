import ProductItem from '../ProductItem';

const ProductGrid = ({ products, className = 'row g-3 g-md-4' }) => (
	<div className={className}>
		{products.map((product) => (
			<div
				key={product.id}
				className="col-12 col-sm-6 col-md-4 col-lg-3"
			>
				<ProductItem product={product} />
			</div>
		))}
	</div>
);

export default ProductGrid;
