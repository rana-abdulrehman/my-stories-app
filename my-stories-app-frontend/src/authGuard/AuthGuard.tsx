import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
    children: ReactNode;
    requiredRole?: 'admin' | 'user';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
    const location = useLocation();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
        // If user is logged in, redirect away from login and signup pages
        return <Navigate to="/" replace />;
    }

    if (requiredRole === 'admin' && user?.role !== 'admin') {
        // If admin role is required but user is not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AuthGuard;

