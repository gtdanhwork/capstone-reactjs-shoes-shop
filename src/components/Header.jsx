import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productService } from '../services/productService';

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const cartItems = useSelector((state) => state.cart.cart);
	const totalCartQty = cartItems.reduce(
		(sum, item) => sum + item.quantity,
		0,
	);

	const [user, setUser] = useState(null);
	const [categories, setCategories] = useState([]);

	// Fetch product categories on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const catData = await productService.getAllCategory();
				setCategories(catData || []);
			} catch (error) {
				console.error('Error fetching categories for header:', error);
			}
		};
		fetchCategories();
	}, []);

	// Update auth status whenever location changes
	useEffect(() => {
		const userLoginStr = localStorage.getItem('userLogin');
		const token = localStorage.getItem('accessToken');
		if (token && userLoginStr) {
			try {
				setUser(JSON.parse(userLoginStr));
			} catch (e) {
				setUser(null);
			}
		} else {
			setUser(null);
		}
	}, [location]);

	const handleLogout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('userLogin');
		setUser(null);
		alert('Đăng xuất thành công!');
		navigate('/login');
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
			<div className="container-fluid">
				{/* Brand / Logo */}
				<Link
					to="/"
					className="navbar-brand text-white fw-bold d-flex align-items-center"
				>
					<img
						src="/cybersoft.png"
						alt="CyberSoft Logo"
						height="30"
						className="me-2"
					/>
				</Link>

				{/* Mobile Toggle Button */}
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#headerNavbar"
					aria-controls="headerNavbar"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div
					className="collapse navbar-collapse"
					id="headerNavbar"
				>
					{/* Main Navigation Links */}
					<ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
						<li className="nav-item">
							<Link
								className={`nav-link ${location.pathname === '/' ? 'active fw-bold' : ''}`}
								to="/"
							>
								Home
							</Link>
						</li>

						{/* Dynamic Category Links */}
						{categories.map((cat) => (
							<li
								className="nav-item"
								key={cat.id}
							>
								<Link
									className="nav-link text-capitalize"
									to={`/search?categoryId=${cat.id}`}
								>
									{cat.category || cat.id}
								</Link>
							</li>
						))}
					</ul>

					{/* Right Side: Search Icon, Cart, and Auth Controls */}
					<div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
						{/* Search Quick Link */}
						<Link
							to="/search"
							className="text-white text-decoration-none fs-5 me-2"
							title="Search"
						>
							<i className="bi bi-search"></i>
						</Link>

						{/* Cart Icon with Dynamic Counter Badge */}
						<Link
							to="/carts"
							className="text-white text-decoration-none position-relative fs-5 me-2"
						>
							<i className="bi bi-cart"></i>
							{totalCartQty > 0 && (
								<span
									className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
									style={{ fontSize: '0.65rem' }}
								>
									{totalCartQty}
								</span>
							)}
						</Link>

						{/* Auth Controls */}
						{user ? (
							<div className="d-flex align-items-center gap-3">
								<Link
									to="/profile"
									className="text-white text-decoration-none fw-bold d-flex align-items-center gap-1"
								>
									<i className="bi bi-person-circle fs-5"></i>{' '}
									{user.name || user.email}
								</Link>
								<button
									className="btn btn-outline-light btn-sm fw-bold"
									onClick={handleLogout}
								>
									Logout
								</button>
							</div>
						) : (
							<div className="d-flex align-items-center gap-2">
								<Link
									to="/login"
									className="text-white text-decoration-none fw-bold px-2"
								>
									Login
								</Link>
								<span className="text-muted">|</span>
								<Link
									to="/register"
									className="text-white text-decoration-none fw-bold px-2"
								>
									Register
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;
