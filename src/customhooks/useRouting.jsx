import {
	useNavigate,
	useParams,
	useSearchParams,
	useLocation,
} from 'react-router-dom';

export const useRouting = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	// Helper to quickly get a query parameter value by name
	const getQueryParam = (key) => searchParams.get(key);

	// Helper to update query parameters easily
	const setQueryParam = (key, value) => {
		const newParams = new URLSearchParams(searchParams);
		if (value) {
			newParams.set(key, value);
		} else {
			newParams.delete(key);
		}
		setSearchParams(newParams);
	};

	return {
		navigate,
		params,
		searchParams,
		setSearchParams,
		location,
		getQueryParam,
		setQueryParam,
	};
};

export default useRouting;
