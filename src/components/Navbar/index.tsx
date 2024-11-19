// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const Navbar: React.FC = () => {
  const { user, setUser } = useStore();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">StoryApp</div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:underline">Home</Link>
          {!user && (
            <>
              <Link to="/signup" className="text-white hover:underline">Sign Up</Link>
              <Link to="/login" className="text-white hover:underline">Log In</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/create-post" className="text-white hover:underline">Create Post</Link>
              {user.isAdmin && (
                <Link to="/admin-board" className="text-white hover:underline">Admin Board</Link>
              )}
              <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;