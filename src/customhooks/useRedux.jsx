import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useRedux = () => {
	const rootState = useSelector((rootReducer) => rootReducer);
	const dispatch = useDispatch();

	return {
		rootState,
		dispatch,
	};
};

export default useRedux;
