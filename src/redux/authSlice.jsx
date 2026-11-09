import { createSlice } from '@reduxjs/toolkit';

const loadStoredUser = () => {
	try {
		const user = localStorage.getItem('userLogin');
		return user ? JSON.parse(user) : null;
	} catch {
		return null;
	}
};

const storedToken = localStorage.getItem('accessToken');
const initialState = {
	token: storedToken,
	user: storedToken ? loadStoredUser() : null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		clearCredentials: (state) => {
			state.token = null;
			state.user = null;
		},
	},
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const login = ({ token, user }) => (dispatch) => {
	localStorage.setItem('accessToken', token);
	localStorage.setItem('userLogin', JSON.stringify(user));
	dispatch(setCredentials({ token, user }));
};

export const logout = () => (dispatch) => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('userLogin');
	dispatch(clearCredentials());
};

export default authSlice.reducer;
