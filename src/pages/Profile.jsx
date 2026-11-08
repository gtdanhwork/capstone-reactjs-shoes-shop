import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userService } from '../services/userService';

const Profile = () => {
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState(null);
	const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'favorites', 'security'
	const [favorites, setFavorites] = useState([]);
	const [serverMsg, setServerMsg] = useState({ type: '', message: '' });
	const [avatarUrl, setAvatarUrl] = useState('');

	const handleAvatarFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file size or type if needed (e.g. max 2MB)
			if (file.size > 2 * 1024 * 1024) {
				alert('File size must be less than 2MB');
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				// Set the Base64 result as the avatar URL/value
				const base64String = reader.result;
				setAvatarUrl(base64String);
				formik.setFieldValue('avatar', base64String);
			};
			reader.readAsDataURL(file);
		}
	};

	// Load User Profile and Favorites on Mount
	// Load User Profile and Favorites on Mount
	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			alert('Vui lòng đăng nhập để xem thông tin tài khoản!');
			navigate('/login');
			return;
		}

		const fetchUserData = async () => {
			try {
				const user = await userService.getProfile();
				setProfileData(user);
				setAvatarUrl(user.avatar || 'https://i.pravatar.cc/150');

				// Populate Formik fields
				formik.setValues({
					email: user.email || '',
					password: '',
					name: user.name || '',
					phone: user.phone || '',
					gender: user.gender ?? true,
					avatar: user.avatar || '',
				});

				// Fetch favorite products with fallback to user profile data
				const favs = await userService.getFavoriteProducts();
				const combinedFavs =
					favs.length > 0 ? favs : user.productsFavorite || [];
				setFavorites(combinedFavs);
			} catch (err) {
				console.error('Error retrieving profile:', err);
			}
		};

		fetchUserData();
	}, [navigate]);

	// Formik & Yup Validation for Profile Updates
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			name: '',
			phone: '',
			gender: true,
			avatar: '',
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			password: Yup.string().min(
				6,
				'Password must be at least 6 characters',
			),
			name: Yup.string()
				.matches(
					/^[a-zA-ZÀ-ỹ\s]+$/,
					'Name can only contain letters and spaces',
				)
				.required('Name is required'),
			phone: Yup.string()
				.matches(/^[0-9]+$/, 'Phone number must contain numbers only')
				.min(9, 'Phone must be at least 9 digits')
				.required('Phone is required'),
			gender: Yup.boolean().required('Please select gender'),
			avatar: Yup.string().url('Must be a valid image URL').nullable(),
		}),
		onSubmit: async (values) => {
			setServerMsg({ type: '', message: '' });
			try {
				const payload = {
					email: values.email,
					name: values.name,
					phone: values.phone,
					gender: values.gender,
				};

				if (values.avatar) {
					payload.avatar = values.avatar;
				}

				if (values.password && values.password.trim() !== '') {
					payload.password = values.password;
				}

				await userService.updateProfile(payload);
				setServerMsg({
					type: 'success',
					message: 'Cập nhật thông tin thành công!',
				});
				if (values.avatar) {
					setAvatarUrl(values.avatar);
				}
				formik.setFieldValue('password', '');
			} catch (err) {
				setServerMsg({
					type: 'danger',
					message:
						err.response?.data?.message ||
						'Cập nhật thất bại. Vui lòng thử lại.',
				});
			}
		},
	});

	// Password Change Formik
	const passwordFormik = useFormik({
		initialValues: {
			newPassword: '',
			confirmPassword: '',
		},
		validationSchema: Yup.object().shape({
			newPassword: Yup.string()
				.min(6, 'Password must be at least 6 characters')
				.required('New password is required'),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
				.required('Confirm password is required'),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				await userService.updateProfile({
					email: formik.values.email,
					name: formik.values.name,
					phone: formik.values.phone,
					gender: formik.values.gender,
					password: values.newPassword,
				});
				alert('Đổi mật khẩu thành công!');
				resetForm();
			} catch (err) {
				alert(
					err.response?.data?.message ||
						'Đổi mật khẩu thất bại. Vui lòng thử lại.',
				);
			}
		},
	});

	if (!profileData) {
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

	return (
		<div className="profile-page py-4">
			<div className="container">
				{/* Profile Header Bar */}
				<div
					className="py-2 px-4 rounded text-white mb-4"
					style={{
						background:
							'linear-gradient(90deg, #8a2387, #e94057, #f27121)',
					}}
				>
					<h3 className="m-0 fw-bold">Profile</h3>
				</div>

				{/* User Info Form */}
				<div className="row align-items-center mb-5 bg-light p-4 rounded shadow-sm">
					{/* Avatar Section */}
					<div className="col-md-3 text-center mb-4 mb-md-0">
						<div className="position-relative d-inline-block">
							<img
								src={avatarUrl}
								alt={profileData.name}
								className="rounded-circle shadow-sm mb-2"
								style={{
									width: '130px',
									height: '130px',
									objectFit: 'cover',
								}}
								onError={(e) => {
									e.target.src = 'https://i.pravatar.cc/150';
								}}
							/>
						</div>

						<div className="mb-2">
							<label
								htmlFor="avatarFileInput"
								className="btn btn-outline-dark btn-sm fw-bold w-100"
								style={{ cursor: 'pointer' }}
							>
								<i className="bi bi-upload me-1"></i> Upload
								from PC
							</label>
							<input
								id="avatarFileInput"
								type="file"
								accept="image/*"
								className="d-none"
								onChange={handleAvatarFileChange}
							/>
						</div>
						<div>
							<label className="form-label fw-bold">
								Avatar Image URL or Upload
							</label>
							<input
								type="text"
								name="avatar"
								placeholder="https://example.com/avatar.jpg"
								className={`form-control ${
									formik.touched.avatar &&
									formik.errors.avatar
										? 'is-invalid'
										: ''
								}`}
								{...formik.getFieldProps('avatar')}
								onChange={(e) => {
									formik.handleChange(e);
									setAvatarUrl(e.target.value);
								}}
							/>
							{formik.touched.avatar && formik.errors.avatar && (
								<div className="invalid-feedback">
									{formik.errors.avatar}
								</div>
							)}
						</div>
					</div>

					<div className="col-md-9">
						{serverMsg.message && (
							<div className={`alert alert-${serverMsg.type}`}>
								{serverMsg.message}
							</div>
						)}

						<form onSubmit={formik.handleSubmit}>
							<div className="row g-3">
								{/* Email (Read Only) */}
								<div className="col-md-6">
									<label className="form-label fw-bold">
										Email
									</label>
									<input
										type="email"
										className="form-control"
										value={formik.values.email}
										disabled
									/>
								</div>

								{/* Name */}
								<div className="col-md-6">
									<label className="form-label fw-bold">
										Name
									</label>
									<input
										type="text"
										name="name"
										className={`form-control ${
											formik.touched.name &&
											formik.errors.name
												? 'is-invalid'
												: ''
										}`}
										{...formik.getFieldProps('name')}
									/>
									{formik.touched.name &&
										formik.errors.name && (
											<div className="invalid-feedback">
												{formik.errors.name}
											</div>
										)}
								</div>

								{/* Phone */}
								<div className="col-md-6">
									<label className="form-label fw-bold">
										Phone
									</label>
									<input
										type="text"
										name="phone"
										className={`form-control ${
											formik.touched.phone &&
											formik.errors.phone
												? 'is-invalid'
												: ''
										}`}
										{...formik.getFieldProps('phone')}
									/>
									{formik.touched.phone &&
										formik.errors.phone && (
											<div className="invalid-feedback">
												{formik.errors.phone}
											</div>
										)}
								</div>

								{/* Gender */}
								<div className="col-md-6">
									<label className="form-label fw-bold d-block">
										Gender
									</label>
									<div className="form-check form-check-inline me-4 mt-2">
										<input
											className="form-check-input"
											type="radio"
											name="gender"
											id="profileMale"
											checked={
												formik.values.gender === true
											}
											onChange={() =>
												formik.setFieldValue(
													'gender',
													true,
												)
											}
										/>
										<label
											className="form-check-label"
											htmlFor="profileMale"
										>
											Male
										</label>
									</div>
									<div className="form-check form-check-inline mt-2">
										<input
											className="form-check-input"
											type="radio"
											name="gender"
											id="profileFemale"
											checked={
												formik.values.gender === false
											}
											onChange={() =>
												formik.setFieldValue(
													'gender',
													false,
												)
											}
										/>
										<label
											className="form-check-label"
											htmlFor="profileFemale"
										>
											Female
										</label>
									</div>
								</div>
							</div>

							<div className="mt-4 text-end">
								<button
									type="submit"
									className="btn text-white px-4 py-2 rounded-pill fw-bold"
									style={{ backgroundColor: '#8a2387' }}
								>
									Update Profile
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Tab Selection */}
				<div className="d-flex gap-4 border-bottom mb-4">
					<button
						className={`btn btn-link text-decoration-none fw-bold pb-2 ${
							activeTab === 'orders'
								? 'border-bottom border-3 border-danger text-danger'
								: 'text-secondary'
						}`}
						onClick={() => setActiveTab('orders')}
					>
						Order history
					</button>
					<button
						className={`btn btn-link text-decoration-none fw-bold pb-2 ${
							activeTab === 'favorites'
								? 'border-bottom border-3 border-danger text-danger'
								: 'text-secondary'
						}`}
						onClick={() => setActiveTab('favorites')}
					>
						Favourite ({favorites.length})
					</button>
					<button
						className={`btn btn-link text-decoration-none fw-bold pb-2 ${
							activeTab === 'security'
								? 'border-bottom border-3 border-danger text-danger'
								: 'text-secondary'
						}`}
						onClick={() => setActiveTab('security')}
					>
						Security
					</button>
				</div>

				{/* Tab Content: Order History */}
				{activeTab === 'orders' && (
					<div>
						{profileData.ordersHistory &&
						profileData.ordersHistory.length > 0 ? (
							profileData.ordersHistory.map((order) => (
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
												{order.orderDetail?.map(
													(item, idx) => (
														<tr key={idx}>
															<td>
																{item.id ||
																	idx + 1}
															</td>
															<td>
																<img
																	src={
																		item.image
																	}
																	alt={
																		item.name
																	}
																	style={{
																		width: '50px',
																		height: '50px',
																		objectFit:
																			'contain',
																	}}
																/>
															</td>
															<td>{item.name}</td>
															<td>
																{item.price}$
															</td>
															<td>
																{item.quantity}
															</td>
															<td className="fw-bold">
																{item.price *
																	item.quantity}
																$
															</td>
														</tr>
													),
												)}
											</tbody>
										</table>
									</div>
								</div>
							))
						) : (
							<p className="text-muted">No orders found.</p>
						)}
					</div>
				)}

				{/* Tab Content: Favorites */}
				{activeTab === 'favorites' && (
					<div className="row g-3 g-md-4">
						{favorites && favorites.length > 0 ? (
							favorites.map((prod, index) => {
								// Handle flattened or nested product object structures
								const item = prod.product || prod;
								const productId =
									item.id || item.productId || index;
								// Fallback for price property
								const productPrice =
									item.price ?? item.cost ?? '0';

								return (
									<div
										className="col-12 col-sm-6 col-md-4 col-lg-3"
										key={productId}
									>
										<div className="card h-100 shadow-sm border-0 p-3 bg-light text-center">
											<img
												src={item.image}
												alt={item.name}
												className="img-fluid mb-2 mx-auto"
												style={{
													height: '160px',
													objectFit: 'contain',
												}}
											/>
											<h5 className="fw-bold fs-6 text-truncate">
												{item.name}
											</h5>
											<Link
												to={`/detail/${item.id}`}
												className="btn btn-dark btn-sm fw-bold mt-auto"
											>
												View Product
											</Link>
										</div>
									</div>
								);
							})
						) : (
							<p className="text-muted col-12">
								No favorite products saved.
							</p>
						)}
					</div>
				)}

				{/* Tab Content: Security / Password Change */}
				{activeTab === 'security' && (
					<div className="col-12 col-md-6 bg-light p-4 rounded shadow-sm mx-auto">
						<h5 className="fw-bold mb-3">Change Password</h5>
						<form onSubmit={passwordFormik.handleSubmit}>
							<div className="mb-3">
								<label className="form-label fw-bold">
									New Password
								</label>
								<input
									type="password"
									className={`form-control ${
										passwordFormik.touched.newPassword &&
										passwordFormik.errors.newPassword
											? 'is-invalid'
											: ''
									}`}
									{...passwordFormik.getFieldProps(
										'newPassword',
									)}
								/>
								{passwordFormik.touched.newPassword &&
									passwordFormik.errors.newPassword && (
										<div className="invalid-feedback">
											{passwordFormik.errors.newPassword}
										</div>
									)}
							</div>

							<div className="mb-3">
								<label className="form-label fw-bold">
									Confirm New Password
								</label>
								<input
									type="password"
									className={`form-control ${
										passwordFormik.touched
											.confirmPassword &&
										passwordFormik.errors.confirmPassword
											? 'is-invalid'
											: ''
									}`}
									{...passwordFormik.getFieldProps(
										'confirmPassword',
									)}
								/>
								{passwordFormik.touched.confirmPassword &&
									passwordFormik.errors.confirmPassword && (
										<div className="invalid-feedback">
											{
												passwordFormik.errors
													.confirmPassword
											}
										</div>
									)}
							</div>

							<button
								type="submit"
								className="btn btn-dark w-100 fw-bold"
							>
								Update Password
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
