import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
    children: ReactNode;
    requiredRole?: 'admin' | 'user';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    
    if (!token && location.pathname !== '/login' && location.pathname !== '/signup') {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    
    if (token && (location.pathname === '/login' || location.pathname === '/signup')) {
        return <Navigate to="/" replace />;
    }

    
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AuthGuard;