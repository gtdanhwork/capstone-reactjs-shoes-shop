import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileDetails from '../components/profile/ProfileDetails';
import OrderHistory from '../components/profile/OrderHistory';
import FavoriteProducts from '../components/profile/FavoriteProducts';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import useRouting from '../customhooks/useRouting';
import PageTitle from '../components/PageTitle';

const PROFILE_TABS = [
	{ id: 'orders', label: 'Order history' },
	{ id: 'favorites', label: 'Favourite' },
	{ id: 'security', label: 'Security' },
];

const Profile = () => {
	const { navigate } = useRouting();
	const token = useSelector((state) => state.auth.token);
	const [profileData, setProfileData] = useState(null);
	const [activeTab, setActiveTab] = useState('orders');
	const [favorites, setFavorites] = useState([]);
	const [serverMsg, setServerMsg] = useState({ type: '', message: '' });
	const [avatarUrl, setAvatarUrl] = useState('');

	const formik = useFormik({
		initialValues: {
			email: '',
			name: '',
			phone: '',
			gender: true,
			avatar: '',
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
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

				if (values.avatar) payload.avatar = values.avatar;
				await userService.updateProfile(payload);
				setServerMsg({
					type: 'success',
					message: 'Cập nhật thông tin thành công!',
				});
				if (values.avatar) setAvatarUrl(values.avatar);
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
	const { setValues } = formik;

	useEffect(() => {
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
				setValues({
					email: user.email || '',
					name: user.name || '',
					phone: user.phone || '',
					gender: user.gender ?? true,
					avatar: user.avatar || '',
				});

				const userFavorites = await userService.getFavoriteProducts();
				setFavorites(
					userFavorites.length > 0
						? userFavorites
						: user.productsFavorite || [],
				);
			} catch (err) {
				console.error('Error retrieving profile:', err);
			}
		};

		fetchUserData();
	}, [navigate, setValues, token]);

	const handleAvatarFileChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			alert('File size must be less than 2MB');
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarUrl(reader.result);
			formik.setFieldValue('avatar', reader.result);
		};
		reader.readAsDataURL(file);
	};

	if (!profileData) return <LoadingSpinner />;

	const tabContent = {
		orders: <OrderHistory orders={profileData.ordersHistory} />,
		favorites: <FavoriteProducts favorites={favorites} />,
		security: <ChangePasswordForm profile={formik.values} />,
	};

	return (
		<div className="profile-page py-4">
			<div className="container">
				<PageTitle>Profile</PageTitle>

				<ProfileDetails
					formik={formik}
					profileData={profileData}
					avatarUrl={avatarUrl}
					setAvatarUrl={setAvatarUrl}
					serverMsg={serverMsg}
					onAvatarFileChange={handleAvatarFileChange}
				/>

				<div className="d-flex gap-4 border-bottom mb-4">
					{PROFILE_TABS.map(({ id, label }) => (
						<button
							key={id}
							className={`btn btn-link text-decoration-none fw-bold pb-2 ${
								activeTab === id
									? 'border-bottom border-3 border-danger text-danger'
									: 'text-secondary'
							}`}
							onClick={() => setActiveTab(id)}
						>
							{label}
							{id === 'favorites' && ` (${favorites.length})`}
						</button>
					))}
				</div>

				{tabContent[activeTab]}
			</div>
		</div>
	);
};

export default Profile;
