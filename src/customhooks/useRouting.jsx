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

	const getQueryParam = (key) => searchParams.get(key);

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
