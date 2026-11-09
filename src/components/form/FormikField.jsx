const FormikField = ({
	formik,
	name,
	label,
	type = 'text',
	placeholder,
	wrapperClassName = 'mb-3',
	inputClassName = '',
	...inputProps
}) => {
	const hasError = formik.touched[name] && formik.errors[name];
	const inputId = inputProps.id || name;

	return (
		<div className={wrapperClassName}>
			<label
				className="form-label fw-bold"
				htmlFor={inputId}
			>
				{label}
			</label>
			<input
				id={inputId}
				type={type}
				placeholder={placeholder}
				className={`form-control ${hasError ? 'is-invalid' : ''} ${inputClassName}`}
				{...formik.getFieldProps(name)}
				{...inputProps}
			/>
			{hasError && (
				<div className="invalid-feedback">{formik.errors[name]}</div>
			)}
		</div>
	);
};

export default FormikField;
