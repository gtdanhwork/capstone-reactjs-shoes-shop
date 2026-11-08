import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeTemplate from './templates/HomeTemplate';
import UserTemplate from './templates/UserTemplate';
import Home from './pages/Home';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Carts from './pages/Carts';

import './assets/scss/index.scss';

function App() {
	return (
		<BrowserRouter basename="/capstone-reactjs-shoes-shop">
			<Routes>
				{/* Main Shop Routes wrapped with HomeTemplate */}
				<Route
					path="/"
					element={<HomeTemplate />}
				>
					<Route
						index
						element={<Home />}
					/>
					<Route
						path="search"
						element={<Search />}
					/>
					<Route
						path="detail/:id"
						element={<Detail />}
					/>
					<Route
						path="profile"
						element={<Profile />}
					/>
					<Route
						path="carts"
						element={<Carts />}
					/>
				</Route>

				{/* Authentication Routes wrapped with UserTemplate */}
				<Route element={<UserTemplate />}>
					<Route
						path="login"
						element={<Login />}
					/>
					<Route
						path="register"
						element={<Register />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
