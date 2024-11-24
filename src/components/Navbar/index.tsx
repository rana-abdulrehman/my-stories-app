// Navbar.tsx
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-[100] bg-slate-200 text-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row justify-between items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-xl">StoryStream</span>
        </a>
        <div className="space-x-4">
          <Link to="/" className="mr-5 text-gray-900 hover:underline hover:text-[#007bff] font-semibold">Home</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin-board" className="text-gray-900 hover:underline hover:text-[#007bff] font-semibold">Admin Board</Link>
              )}
              {user.role !== 'admin' && (
                <Link to="/create-post" className="text-gray-900 hover:underline hover:text-[#007bff] font-semibold">Create Post</Link>
              )}
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Sign Up
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/login" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Log In
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;