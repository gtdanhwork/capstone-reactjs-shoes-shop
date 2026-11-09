import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import useRouting from '../customhooks/useRouting';
import FacebookLoginBtn from '../components/FacebookLoginBtn';
import FormikField from '../components/form/FormikField';
import AuthPage from '../components/AuthPage';
import { login } from '../redux/authSlice';

const Login = () => {
	const { navigate } = useRouting();
	const dispatch = useDispatch();
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
				dispatch(
					login({
						token: response.content.accessToken,
						user: response.content,
					}),
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
		<AuthPage
			title="Login"
			onBack={() => navigate(-1)}
		>
			{serverError && (
				<div className="alert alert-danger">{serverError}</div>
			)}
			<form onSubmit={formik.handleSubmit}>
				<FormikField
					formik={formik}
					name="email"
					label="Email"
					type="email"
					placeholder="email"
				/>
				<FormikField
					formik={formik}
					name="password"
					label="Password"
					type="password"
					placeholder="password"
					wrapperClassName="mb-4"
				/>

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
					<FacebookLoginBtn />
				</div>
			</form>
		</AuthPage>
	);
};

export default Login;
