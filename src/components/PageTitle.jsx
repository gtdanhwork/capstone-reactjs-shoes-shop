const PageTitle = ({ children }) => (
	<div
		className="py-2 px-4 rounded text-white mb-4"
		style={{
			background: 'linear-gradient(90deg, #8a2387, #e94057, #f27121)',
		}}
	>
		<h3 className="m-0 fw-bold">{children}</h3>
	</div>
);

export default PageTitle;
