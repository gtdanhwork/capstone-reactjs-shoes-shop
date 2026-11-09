import FacebookLoginModule from '@greatsumini/react-facebook-login';
import useRouting from '../customhooks/useRouting';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { userService } from '../services/userService';

const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;

const FacebookLoginBtn = () => {
	const { navigate } = useRouting();
	const dispatch = useDispatch();
	const handleFacebookSuccess = async (response) => {
		try {
			console.log('Facebook SDK Response:', response);
			const fbToken = response.accessToken;

			if (fbToken) {
				const data = await userService.facebookLogin(fbToken);

				dispatch(
					login({
						token: data.accessToken,
						user: data,
					}),
				);

				alert('Đăng nhập Facebook thành công!');
				navigate('/');
			}
		} catch (error) {
			console.error('Facebook login API error:', error);
			alert('Đăng nhập Facebook thất bại từ server.');
		}
	};

	return (
		<FacebookLogin
			appId="2206766446854373"
			onSuccess={handleFacebookSuccess}
			scope="public_profile,email"
			onFail={(error) => console.log('Facebook Login Failed:', error)}
			render={({ onClick }) => (
				<button
					type="button"
					onClick={onClick}
					className="btn btn-primary w-100 fw-bold py-2"
				>
					<i className="bi bi-facebook me-2"></i> Continue with
					Facebook
				</button>
			)}
		/>
	);
};

export default FacebookLoginBtn;
