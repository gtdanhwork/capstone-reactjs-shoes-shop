import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { http } from '../middlewares/interceptors';
import useRouting from '../customhooks/useRouting';
import CartItemsTable from '../components/cart/CartItemsTable';
import CartSummary from '../components/cart/CartSummary';
import PageTitle from '../components/PageTitle';

const Carts = () => {
	const dispatch = useDispatch();
	const { navigate } = useRouting();
	const cartItems = useSelector((state) => state.cart.cart);
	const token = useSelector((state) => state.auth.token);
	const user = useSelector((state) => state.auth.user);
	const [loading, setLoading] = useState(false);

	const handleQuantityChange = (item, delta) => {
		const newQty = item.quantity + delta;
		if (newQty > 0) {
			dispatch(
				updateQuantity({
					id: item.id,
					size: item.size,
					quantity: newQty,
				}),
			);
		}
	};

	const handleRemove = (item) => {
		dispatch(removeFromCart({ id: item.id, size: item.size }));
	};

	const handleCheckout = async () => {
		if (!token) {
			alert('Vui lòng đăng nhập để tiến hành thanh toán!');
			navigate('/login');
			return;
		}

		if (cartItems.length === 0) {
			alert('Giỏ hàng của bạn đang trống!');
			return;
		}

		try {
			setLoading(true);
			const orderPayload = {
				orderDetail: cartItems.map((item) => ({
					productId: String(item.id),
					quantity: item.quantity,
				})),
				email: user?.email || '',
			};

			await http.post('/Users/order', orderPayload);
			alert('Đặt hàng thành công!');
			dispatch(clearCart());
			navigate('/profile');
		} catch (err) {
			console.error('Order submission error:', err);
			alert(
				err.response?.data?.message ||
					'Đặt hàng thất bại. Vui lòng thử lại.',
			);
		} finally {
			setLoading(false);
		}
	};

	const totalAmount = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<div className="container py-4">
			<PageTitle>Carts</PageTitle>

			{cartItems.length === 0 ? (
				<div className="text-center py-5 bg-light rounded shadow-sm">
					<p className="text-muted fs-5 mb-3">
						Giỏ hàng của bạn đang trống.
					</p>
					<button
						className="btn btn-primary fw-bold"
						onClick={() => navigate('/')}
					>
						Tiếp tục mua sắm
					</button>
				</div>
			) : (
				<div>
					<CartItemsTable
						items={cartItems}
						onQuantityChange={handleQuantityChange}
						onRemove={handleRemove}
					/>
					<CartSummary
						totalAmount={totalAmount}
						loading={loading}
						onCheckout={handleCheckout}
					/>
				</div>
			)}
		</div>
	);
};

export default Carts;
