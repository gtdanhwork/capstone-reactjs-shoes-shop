const CartItemsTable = ({ items, onQuantityChange, onRemove }) => (
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
				{items.map((item, index) => (
					<tr key={`${item.id}-${item.size}`}>
						<td>{index + 1}</td>
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
							<span className="fw-bold">{item.name}</span>
							<br />
							<small className="text-muted">
								Size: {item.size}
							</small>
						</td>
						<td>{item.price}$</td>
						<td>
							<div className="d-flex align-items-center gap-2">
								<button
									type="button"
									className="btn btn-sm btn-primary px-2"
									onClick={() => onQuantityChange(item, -1)}
								>
									-
								</button>
								<span className="fw-bold">{item.quantity}</span>
								<button
									type="button"
									className="btn btn-sm btn-primary px-2"
									onClick={() => onQuantityChange(item, 1)}
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
								type="button"
								className="btn btn-danger btn-sm"
								onClick={() => onRemove(item)}
							>
								Delete
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default CartItemsTable;
