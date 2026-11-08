import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userService } from '../services/userService';

const Profile = () => {
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState(null);
	const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'favorites'
	const [favorites, setFavorites] = useState([]);
	const [serverMsg, setServerMsg] = useState({ type: '', message: '' });

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

				// Populate Formik fields
				formik.setValues({
					email: user.email || '',
					password: '',
					name: user.name || '',
					phone: user.phone || '',
					gender: user.gender ?? true,
				});

				// Fetch favorite products
				const favs = await userService.getFavoriteProducts();
				setFavorites(favs || []);
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

				// Attach password to payload if provided
				if (values.password.trim() !== '') {
					payload.password = values.password;
				}

				await userService.updateProfile(payload);
				setServerMsg({
					type: 'success',
					message: 'Cập nhật thông tin thành công!',
				});
				formik.setFieldValue('password', ''); // Clear password field after update
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
				<div className="py-2 px-4 rounded text-white mb-4 profile-title-bar">
					<h3 className="m-0 fw-bold">Profile</h3>
				</div>

				{/* User Info Form */}
				<div className="row align-items-center mb-5 bg-light p-4 rounded shadow-sm">
					<div className="col-md-3 text-center mb-4 mb-md-0">
						<img
							src={
								profileData.avatar ||
								'https://i.pravatar.cc/150'
							}
							alt={profileData.name}
							className="avatar-img shadow-sm img-fluid"
						/>
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

								{/* Password */}
								<div className="col-md-6">
									<label className="form-label fw-bold">
										Password
									</label>
									<input
										type="password"
										name="password"
										placeholder="Enter new password to change"
										className={`form-control ${
											formik.touched.password &&
											formik.errors.password
												? 'is-invalid'
												: ''
										}`}
										{...formik.getFieldProps('password')}
									/>
									{formik.touched.password &&
										formik.errors.password && (
											<div className="invalid-feedback">
												{formik.errors.password}
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
									className="btn btn-update-profile px-4 py-2 rounded-pill"
								>
									Update
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Tab Selection */}
				<div className="d-flex gap-4 border-bottom mb-4">
					<button
						className={`btn btn-primary ${activeTab === 'orders' ? 'active' : ''}`}
						onClick={() => setActiveTab('orders')}
					>
						Order history
					</button>
					<button
						className={`btn btn-secondary ${activeTab === 'favorites' ? 'active' : ''}`}
						onClick={() => setActiveTab('favorites')}
					>
						Favourite
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
										Orders have been placed on {order.date}
									</p>
									<div className="table-responsive">
										<table className="table align-middle bg-light">
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
					<div className="row g-4">
						{favorites.length > 0 ? (
							favorites.map((prod) => (
								<div
									className="col-12 col-sm-6 col-md-4"
									key={prod.id}
								>
									<div className="card h-100 shadow-sm border-0 p-3 bg-light text-center">
										<img
											src={prod.image}
											alt={prod.name}
											className="img-fluid mb-2"
											style={{
												height: '150px',
												objectFit: 'contain',
											}}
										/>
										<h5 className="fw-bold fs-6">
											{prod.name}
										</h5>
										<p className="text-danger fw-bold">
											{prod.price}$
										</p>
									</div>
								</div>
							))
						) : (
							<p className="text-muted col-12">
								No favorite products saved.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
