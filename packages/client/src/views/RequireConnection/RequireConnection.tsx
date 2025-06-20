import type React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useStorage } from 'src/storage/hooks/useStorage';

export const RequireConnection = (): React.JSX.Element => {
	const location = useLocation();
	const [state] = useStorage();

	if (location.pathname !== '/' && state.general.connectionLost) {
		return <Navigate to="/no-connection" />;
	}

	// if (state.general.connected === false) {
	//   return <></>;
	// }

	return <Outlet />;
};
