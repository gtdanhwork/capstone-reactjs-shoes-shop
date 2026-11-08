import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="footer mt-auto">
			<div className="bg-white py-5 border-top">
				<div className="container">
					<div className="row g-4">
						<div className="col-12 col-md-4 border-end-md">
							<h6 className="fw-bold text-uppercase mb-3">
								GET HELP
							</h6>
							<ul className="list-unstyled mb-0">
								<li className="mb-1">
									<Link
										to="/"
										className="text-dark text-decoration-none"
									>
										Home
									</Link>
								</li>
								<li className="mb-1">
									<Link
										to="/?category=nike"
										className="text-dark text-decoration-none"
									>
										Nike
									</Link>
								</li>
								<li className="mb-1">
									<Link
										to="/?category=adidas"
										className="text-dark text-decoration-none"
									>
										Adidas
									</Link>
								</li>
								<li className="mb-1">
									<Link
										to="/profile"
										className="text-dark text-decoration-none"
									>
										Profile
									</Link>
								</li>
							</ul>
						</div>

						<div className="col-12 col-md-4 border-end-md">
							<h6 className="fw-bold text-uppercase mb-3">
								SUPPORT
							</h6>
							<ul className="list-unstyled mb-0">
								<li className="mb-1">
									<Link
										to="/cart"
										className="text-dark text-decoration-none"
									>
										Cart
									</Link>
								</li>
								<li className="mb-1">
									<Link
										to="/search"
										className="text-dark text-decoration-none"
									>
										Search
									</Link>
								</li>
								<li className="mb-1">
									<Link
										to="/"
										className="text-dark text-decoration-none"
									>
										Help
									</Link>
								</li>
								<li className="mb-1">
									<a
										href="tel:+84123456789"
										className="text-dark text-decoration-none"
									>
										Phone
									</a>
								</li>
							</ul>
						</div>

						<div className="col-12 col-md-4">
							<h6 className="fw-bold text-uppercase mb-3">
								REGISTER
							</h6>
							<ul className="list-unstyled mb-0">
								<li className="mb-1">
									<Link
										to="/register"
										className="text-dark text-decoration-none"
									>
										Register
									</Link>
								</li>
								<li className="mb-1">
									<Link
										to="/login"
										className="text-dark text-decoration-none"
									>
										Login
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-light text-center py-3 border-top">
				<div className="container">
					<p className="mb-0 text-dark small">
						© 2022 Cybersoft All Rights Reserved | Design Theme by
						Trương Tấn Khải.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
