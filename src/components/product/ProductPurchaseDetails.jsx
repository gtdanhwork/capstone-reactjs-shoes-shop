const ProductPurchaseDetails = ({
	product,
	selectedSize,
	quantity,
	onSizeChange,
	onQuantityChange,
	onAddToCart,
}) => (
	<div className="col-lg-7">
		<h1 className="fw-bold mb-3">{product.name}</h1>
		<p className="text-muted">{product.description}</p>
		<h3 className="text-danger fw-bold mb-4">{product.price}$</h3>

		<div className="mb-4">
			<h6 className="fw-bold mb-2">Available size</h6>
			<div className="d-flex flex-wrap gap-2">
				{product.size?.map((size) => (
					<button
						key={size}
						type="button"
						className={`size-btn rounded ${selectedSize === size ? 'active' : ''}`}
						onClick={() => onSizeChange(size)}
					>
						{size}
					</button>
				))}
			</div>
		</div>

		<div className="d-flex align-items-center gap-3 mb-4">
			<div className="quantity-control d-flex align-items-center">
				<button
					type="button"
					onClick={() => onQuantityChange(-1)}
				>
					-
				</button>
				<span>{quantity}</span>
				<button
					type="button"
					onClick={() => onQuantityChange(1)}
				>
					+
				</button>
			</div>
			<button
				type="button"
				className="btn btn-add-cart px-4 py-2 rounded-2"
				onClick={onAddToCart}
			>
				Add to cart
			</button>
		</div>
	</div>
);

export default ProductPurchaseDetails;
