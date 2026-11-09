import FormikField from '../form/FormikField';
import FormikGenderField from '../form/FormikGenderField';

const ProfileDetails = ({
	formik,
	profileData,
	avatarUrl,
	setAvatarUrl,
	serverMsg,
	onAvatarFileChange,
}) => (
	<div className="row align-items-center mb-5 bg-light p-4 rounded shadow-sm">
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
					<i className="bi bi-upload me-1"></i> Upload from PC
				</label>
				<input
					id="avatarFileInput"
					type="file"
					accept="image/*"
					className="d-none"
					onChange={onAvatarFileChange}
				/>
			</div>
			<FormikField
				formik={formik}
				name="avatar"
				label="Avatar Image URL or Upload"
				placeholder="https://example.com/avatar.jpg"
				wrapperClassName=""
				onChange={(event) => {
					formik.handleChange(event);
					setAvatarUrl(event.target.value);
				}}
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
					<FormikField
						formik={formik}
						type="email"
						disabled
						wrapperClassName="col-md-6"
						inputClassName=""
						value={formik.values.email}
						name="email"
						label="Email"
					/>
					<FormikField
						formik={formik}
						name="name"
						label="Name"
						wrapperClassName="col-md-6"
					/>
					<FormikField
						formik={formik}
						name="phone"
						label="Phone"
						wrapperClassName="col-md-6"
					/>
					<FormikGenderField
						formik={formik}
						wrapperClassName="col-md-6"
						optionClassName="form-check form-check-inline mt-2"
						firstOptionClassName="me-4"
					/>
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
);

export default ProfileDetails;
