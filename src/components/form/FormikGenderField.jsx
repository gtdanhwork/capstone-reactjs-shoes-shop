const GENDER_OPTIONS = [
	{ value: true, label: 'Male', id: 'male' },
	{ value: false, label: 'Female', id: 'female' },
];

const FormikGenderField = ({
	formik,
	name = 'gender',
	label = 'Gender',
	wrapperClassName = 'mb-3',
	optionClassName = 'form-check form-check-inline',
	firstOptionClassName = '',
}) => (
	<div className={wrapperClassName}>
		<label className="form-label fw-bold d-block">{label}</label>
		{GENDER_OPTIONS.map((option, index) => (
			<div
				key={option.id}
				className={`${optionClassName} ${
					index === 0 ? firstOptionClassName : ''
				}`}
			>
				<input
					className="form-check-input"
					type="radio"
					name={name}
					id={`${name}-${option.id}`}
					checked={formik.values[name] === option.value}
					onChange={() =>
						formik.setFieldValue(name, option.value)
					}
				/>
				<label
					className="form-check-label"
					htmlFor={`${name}-${option.id}`}
				>
					{option.label}
				</label>
			</div>
		))}
	</div>
);

export default FormikGenderField;
