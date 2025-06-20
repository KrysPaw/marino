import type React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useStorage } from 'src/storage/hooks/useStorage';

export const RequireUser = (): React.JSX.Element => {
	const user = localStorage.getItem('user');
	const code = localStorage.getItem('code');
	const [state] = useStorage();
	const location = useLocation();

	// If the user is "logged in" and trying to access the root, redirect to /menu
	if (location.pathname === '/' && user && state.general.state === 'MENU') {
		return <Navigate to="/menu" />;
	}

	// If the user is "logged in" and trying to access the root, redirect to /menu
	if (
		location.pathname === '/' &&
		user &&
		state.general.state === 'LOBBY' &&
		code
	) {
		return <Navigate to={`/lobby/${code}`} />;
	}

	// If the user is not "logged in" and trying to access a page other than the root, redirect to root
	if (location.pathname !== '/' && !user) return <Navigate to="/" />;

	return <Outlet />;
};
