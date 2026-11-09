import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import useRouting from '../customhooks/useRouting';
import ProductPurchaseDetails from '../components/product/ProductPurchaseDetails';
import RelatedProducts from '../components/product/RelatedProducts';

const Detail = () => {
	const { params } = useRouting();
	const { id } = params;
	const [product, setProduct] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchProductDetail = async () => {
			try {
				const data = await productService.getProductById(id);
				setProduct(data);
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

					<ProductPurchaseDetails
						product={product}
						selectedSize={selectedSize}
						quantity={quantity}
						onSizeChange={setSelectedSize}
						onQuantityChange={(delta) =>
							setQuantity((current) =>
								Math.max(1, current + delta),
							)
						}
						onAddToCart={handleAddToCart}
					/>
				</div>
				<RelatedProducts products={product.relatedProducts} />
			</div>
		</div>
	);
};

export default Detail;
