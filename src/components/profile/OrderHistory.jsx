const OrderHistory = ({ orders = [] }) => {
	const orderList = orders || [];
	if (orderList.length === 0) {
		return <p className="text-muted">No orders found.</p>;
	}

	return orderList.map((order) => (
		<div
			key={order.id}
			className="mb-4"
		>
			<p className="text-muted fst-italic">
				Orders have been placed on{' '}
				{order.date || order.createdAt || 'N/A'}
			</p>
			<div className="table-responsive">
				<table className="table align-middle bg-light text-nowrap">
					<thead className="table-secondary">
						<tr>
							<th>id</th>
							<th>img</th>
							<th>name</th>
							<th>price</th>
							<th>quantity</th>
							<th>total</th>
						</tr>
					</thead>
					<tbody>
						{order.orderDetail?.map((item, index) => (
							<tr key={index}>
								<td>{item.id || index + 1}</td>
								<td>
									<img
										src={item.image}
										alt={item.name}
										style={{
											width: '50px',
											height: '50px',
											objectFit: 'contain',
										}}
									/>
								</td>
								<td>{item.name}</td>
								<td>{item.price}$</td>
								<td>{item.quantity}</td>
								<td className="fw-bold">
									{item.price * item.quantity}$
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	));
};

export default OrderHistory;
