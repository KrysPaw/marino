import type React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

export const RequireUser = (): React.JSX.Element => {
  const user = localStorage.getItem('user');
  const location = useLocation();

  // If the user is "logged in" and trying to access the root, redirect to /menu
  if (location.pathname === '/' && user) return <Navigate to="/menu" />;

  // If the user is not "logged in" and trying to access a page other than the root, redirect to root
  if (location.pathname !== '/' && !user) return <Navigate to="/" />;

  return <Outlet />;
};
