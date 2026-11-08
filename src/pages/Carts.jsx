import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { http } from '../middlewares/interceptors';
import { useNavigate } from 'react-router-dom';

const Carts = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cartItems = useSelector((state) => state.cart.cart);
	const [loading, setLoading] = useState(false);

	const handleQuantityChange = (id, size, currentQty, delta) => {
		const newQty = currentQty + delta;
		if (newQty > 0) {
			dispatch(updateQuantity({ id, size, quantity: newQty }));
		}
	};

	const handleRemove = (id, size) => {
		dispatch(removeFromCart({ id, size }));
	};

	// Submit Order to backend API
	const handleCheckout = async () => {
		const token = localStorage.getItem('accessToken');
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
			// Format payload according to API spec requirements
			const orderPayload = {
				orderDetail: cartItems.map((item) => ({
					productId: String(item.id),
					quantity: item.quantity,
				})),
				email:
					JSON.parse(localStorage.getItem('userLogin'))?.email || '',
			};

			await http.post('/Users/order', orderPayload);
			alert('Đặt hàng thành công!');
			dispatch(clearCart());
			navigate('/profile'); // Redirect to profile order history
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
			<div
				className="py-2 px-4 rounded text-white mb-4"
				style={{
					background:
						'linear-gradient(90deg, #8a2387, #e94057, #f27121)',
				}}
			>
				<h3 className="m-0 fw-bold">Carts</h3>
			</div>

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
					<div className="table-responsive mb-4">
						<table className="table align-middle bg-light shadow-sm rounded">
							<thead className="table-secondary">
								<tr>
									<th>id</th>
									<th>img</th>
									<th>name</th>
									<th>price</th>
									<th>quantity</th>
									<th>total</th>
									<th>action</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.map((item, idx) => (
									<tr key={`${item.id}-${item.size}`}>
										<td>{idx + 1}</td>
										<td>
											<img
												src={item.image}
												alt={item.name}
												style={{
													width: '60px',
													height: '60px',
													objectFit: 'contain',
												}}
											/>
										</td>
										<td>
											<span className="fw-bold">
												{item.name}
											</span>
											<br />
											<small className="text-muted">
												Size: {item.size}
											</small>
										</td>
										<td>{item.price}$</td>
										<td>
											<div className="d-flex align-items-center gap-2">
												<button
													className="btn btn-sm btn-primary px-2"
													onClick={() =>
														handleQuantityChange(
															item.id,
															item.size,
															item.quantity,
															-1,
														)
													}
												>
													-
												</button>
												<span className="fw-bold">
													{item.quantity}
												</span>
												<button
													className="btn btn-sm btn-primary px-2"
													onClick={() =>
														handleQuantityChange(
															item.id,
															item.size,
															item.quantity,
															1,
														)
													}
												>
													+
												</button>
											</div>
										</td>
										<td className="fw-bold text-danger">
											{item.price * item.quantity}$
										</td>
										<td>
											<button
												className="btn btn-danger btn-sm"
												onClick={() =>
													handleRemove(
														item.id,
														item.size,
													)
												}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Cart Summary & Submit Order */}
					<div className="d-flex justify-content-between align-items-center bg-light p-4 rounded shadow-sm">
						<h4 className="fw-bold m-0">
							Tổng tiền:{' '}
							<span className="text-danger">{totalAmount}$</span>
						</h4>
						<button
							className="btn btn-success px-4 py-2 fw-bold"
							style={{
								backgroundColor: '#93D551',
								borderColor: '#93D551',
								color: '#000',
							}}
							onClick={handleCheckout}
							disabled={loading}
						>
							{loading ? 'Đang xử lý...' : 'SUBMIT ORDER'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Carts;
