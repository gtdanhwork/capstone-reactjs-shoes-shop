import FacebookLoginModule from '@greatsumini/react-facebook-login';
import useRouting from '../customhooks/useRouting';

const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;

import React from 'react';
import { userService } from '../services/userService';

const FacebookLoginBtn = (res) => {
	const { navigate } = useRouting();
	const handleFacebookSuccess = async (response) => {
		try {
			console.log('Facebook SDK Response:', response);
			const fbToken = response.accessToken;

			if (fbToken) {
				const data = await userService.facebookLogin(fbToken);

				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('userLogin', JSON.stringify(data));

				alert('Đăng nhập Facebook thành công!');
				navigate('/');
			}
		} catch (error) {
			console.error('Facebook login API error:', error);
			alert('Đăng nhập Facebook thất bại từ server.');
		}
	};

	const handleFacebookFail = (error) => {
		console.error('Facebook Login Failed:', error);
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
