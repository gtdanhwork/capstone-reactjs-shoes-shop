import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../services/productService';
import logoImg from '../assets/media/img/cybersoft.png';

import useRouting from '../customhooks/useRouting';
import { logout } from '../redux/authSlice';

const Header = () => {
	const { navigate, location } = useRouting();
	const dispatch = useDispatch();

	const cartItems = useSelector((state) => state.cart.cart);
	const user = useSelector((state) => state.auth.user);
	const totalCartQty = cartItems.reduce(
		(sum, item) => sum + item.quantity,
		0,
	);

	const [categories, setCategories] = useState([]);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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

	const handleLogout = () => {
		dispatch(logout());
		alert('Đăng xuất thành công!');
		navigate('/login');
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
			<div className="container-fluid">
				<Link
					to="/"
					className="navbar-brand text-white fw-bold d-flex align-items-center"
				>
					<img
						src={logoImg}
						alt="CyberSoft Logo"
						height="30"
						className="me-2"
					/>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					aria-controls="headerNavbar"
					aria-expanded={isMenuOpen}
					aria-label="Toggle navigation"
					onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div
					className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
					id="headerNavbar"
				>
					<ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
						<li className="nav-item">
							<Link
								className={`nav-link ${location.pathname === '/' ? 'active fw-bold' : ''}`}
								to="/"
							>
								Home
							</Link>
						</li>

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

					<div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
						<Link
							to="/search"
							className="text-white text-decoration-none fs-5 me-2"
							title="Search"
						>
							<i className="bi bi-search"></i>
						</Link>

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
