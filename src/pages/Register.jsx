import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import useRouting from '../customhooks/useRouting';
import FormikField from '../components/form/FormikField';
import FormikGenderField from '../components/form/FormikGenderField';
import AuthPage from '../components/AuthPage';

const Register = () => {
	const { navigate } = useRouting();
	const [serverError, setServerError] = useState('');
	const [successMsg, setSuccessMsg] = useState('');

	const signupSchema = Yup.object().shape({
		email: Yup.string()
			.email('Invalid email format')
			.required('Email is required'),
		password: Yup.string()
			.min(6, 'Password must be at least 6 characters')
			.required('Password is required'),
		passwordConfirm: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
			.required('Confirm password is required'),
		name: Yup.string()
			.matches(
				/^[a-zA-ZÀ-ỹ\s]+$/,
				'Name can only contain letters and spaces',
			)
			.required('Name is required'),
		phone: Yup.string()
			.matches(/^[0-9]+$/, 'Phone number must contain only numbers')
			.min(9, 'Phone number must be at least 9 digits')
			.required('Phone is required'),
		gender: Yup.boolean().required('Please select a gender'),
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			passwordConfirm: '',
			name: '',
			phone: '',
			gender: true,
		},
		validationSchema: signupSchema,
		onSubmit: async (values) => {
			setServerError('');
			setSuccessMsg('');

			try {
				const payload = {
					email: values.email,
					password: values.password,
					name: values.name,
					phone: values.phone,
					gender: values.gender,
				};

				await userService.signup(payload);
				setSuccessMsg(
					'Registration successful! Redirecting to login...',
				);
				setTimeout(() => {
					navigate('/login');
				}, 1500);
			} catch (err) {
				setServerError(
					err.response?.data?.message ||
						'Registration failed. Please try again.',
				);
			}
		},
	});

	return (
		<AuthPage
			title="Register"
			onBack={() => navigate(-1)}
		>
			{serverError && (
				<div className="alert alert-danger">{serverError}</div>
			)}
			{successMsg && (
				<div className="alert alert-success">{successMsg}</div>
			)}

			<form onSubmit={formik.handleSubmit}>
				<FormikField
					formik={formik}
					name="email"
					label="Email"
					type="email"
					placeholder="Enter email"
				/>
				<FormikField
					formik={formik}
					name="password"
					label="Password"
					type="password"
					placeholder="Enter password"
				/>
				<FormikField
					formik={formik}
					name="passwordConfirm"
					label="Password confirm"
					type="password"
					placeholder="Confirm password"
				/>
				<FormikField
					formik={formik}
					name="name"
					label="Name"
					placeholder="Enter name (letters and spaces only)"
				/>
				<FormikField
					formik={formik}
					name="phone"
					label="Phone"
					placeholder="Enter phone number (numbers only)"
				/>
				<FormikGenderField
					formik={formik}
					wrapperClassName="mb-4"
				/>

				<button
					type="submit"
					className="btn btn-dark w-100 fw-bold py-2"
				>
					SUBMIT
				</button>
			</form>

			<div className="mt-3 text-center">
				<span className="text-muted">
					Already have an account?{' '}
				</span>
				<Link
					to="/login"
					className="fw-bold text-decoration-none"
				>
					Login here
				</Link>
			</div>
		</AuthPage>
	);
};

export default Register;
