const CartSummary = ({ totalAmount, loading, onCheckout }) => (
	<div className="d-flex justify-content-between align-items-center bg-light p-4 rounded shadow-sm">
		<h4 className="fw-bold m-0">
			Tổng tiền: <span className="text-danger">{totalAmount}$</span>
		</h4>
		<button
			type="button"
			className="btn btn-success px-4 py-2 fw-bold"
			style={{
				backgroundColor: '#93D551',
				borderColor: '#93D551',
				color: '#000',
			}}
			onClick={onCheckout}
			disabled={loading}
		>
			{loading ? 'Đang xử lý...' : 'SUBMIT ORDER'}
		</button>
	</div>
);

export default CartSummary;
