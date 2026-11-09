import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userService } from '../../services/userService';
import FormikField from '../form/FormikField';

const ChangePasswordForm = ({ profile }) => {
	const formik = useFormik({
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
					email: profile.email,
					name: profile.name,
					phone: profile.phone,
					gender: profile.gender,
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

	return (
		<div className="col-12 col-md-6 bg-light p-4 rounded shadow-sm mx-auto">
			<h5 className="fw-bold mb-3">Change Password</h5>
			<form onSubmit={formik.handleSubmit}>
				<FormikField
					formik={formik}
					name="newPassword"
					label="New Password"
					type="password"
				/>
				<FormikField
					formik={formik}
					name="confirmPassword"
					label="Confirm New Password"
					type="password"
				/>
				<button
					type="submit"
					className="btn btn-dark w-100 fw-bold"
				>
					Update Password
				</button>
			</form>
		</div>
	);
};

export default ChangePasswordForm;
