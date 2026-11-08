import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';

const Login = () => {
	const navigate = useNavigate();
	const [serverError, setServerError] = useState('');

	const loginSchema = Yup.object().shape({
		email: Yup.string()
			.email('Invalid email format')
			.required('Email is required'),
		password: Yup.string().required('Password is required'),
	});

	const formik = useFormik({
		initialValues: { email: '', password: '' },
		validationSchema: loginSchema,
		onSubmit: async (values) => {
			setServerError('');
			try {
				const response = await userService.signin(values);
				localStorage.setItem(
					'accessToken',
					response.content.accessToken,
				);
				localStorage.setItem(
					'userLogin',
					JSON.stringify(response.content),
				);

				alert('Đăng nhập thành công!');
				navigate('/profile');
			} catch (err) {
				setServerError(
					err.response?.data?.message ||
						'Login failed. Please check your credentials.',
				);
			}
		},
	});

	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<div className="card shadow-sm border-0 p-4 bg-light">
						{/* Top Navigation Row with Return Button */}
						<div className="d-flex align-items-center justify-content-between mb-4">
							<button
								type="button"
								className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
								onClick={() => navigate(-1)}
							>
								<i className="bi bi-arrow-left"></i> Back
							</button>
							<h2 className="fw-bold m-0">Login</h2>
							<div style={{ width: '60px' }}></div>{' '}
							{/* Spacer to center heading */}
						</div>

						{serverError && (
							<div className="alert alert-danger">
								{serverError}
							</div>
						)}

						<form onSubmit={formik.handleSubmit}>
							<div className="mb-3">
								<label className="form-label fw-bold">
									Email
								</label>
								<input
									type="email"
									name="email"
									className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
									placeholder="email"
									{...formik.getFieldProps('email')}
								/>
								{formik.touched.email &&
									formik.errors.email && (
										<div className="invalid-feedback">
											{formik.errors.email}
										</div>
									)}
							</div>

							<div className="mb-4">
								<label className="form-label fw-bold">
									Password
								</label>
								<input
									type="password"
									name="password"
									className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
									placeholder="password"
									{...formik.getFieldProps('password')}
								/>
								{formik.touched.password &&
									formik.errors.password && (
										<div className="invalid-feedback">
											{formik.errors.password}
										</div>
									)}
							</div>

							<div className="d-flex justify-content-between align-items-center mb-4">
								<Link
									to="/register"
									className="text-decoration-none text-primary fw-bold"
								>
									Register now ?
								</Link>
								<button
									type="submit"
									className="btn btn-primary px-4 fw-bold"
									style={{
										backgroundColor: '#6f42c1',
										borderColor: '#6f42c1',
									}}
								>
									LOGIN
								</button>
							</div>

							<div className="text-center">
								<button
									type="button"
									className="btn text-white w-100 py-2 fw-bold"
									style={{ backgroundColor: '#1877f2' }}
									onClick={() =>
										alert(
											'Facebook login hook can be integrated here!',
										)
									}
								>
									<i className="bi bi-facebook me-2"></i>{' '}
									Continue with Facebook
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
