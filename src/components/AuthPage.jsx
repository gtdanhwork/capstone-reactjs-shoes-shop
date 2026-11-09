const AuthPage = ({ title, onBack, children }) => (
	<div className="container py-5">
		<div className="row justify-content-center">
			<div className="col-md-8 col-lg-6">
				<div className="card shadow-sm border-0 p-4 bg-light">
					<div className="d-flex align-items-center justify-content-between mb-4">
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
							onClick={onBack}
						>
							<i className="bi bi-arrow-left"></i> Back
						</button>
						<h2 className="fw-bold m-0">{title}</h2>
						<div style={{ width: '60px' }}></div>
					</div>
					{children}
				</div>
			</div>
		</div>
	</div>
);

export default AuthPage;
