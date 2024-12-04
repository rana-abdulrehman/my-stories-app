import React, { createContext, useState, useEffect, ReactNode, Dispatch } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string; 
  token: string; 
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  unreadCount: number;
  setUnreadCount: Dispatch<number>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {
    throw new Error("login() is not implemented.");
  },
  logout: () => {
    throw new Error("logout() is not implemented.");
  },
  unreadCount: 0,
  setUnreadCount:()=>{ return 0}
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token); 
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout,unreadCount,setUnreadCount }}>
      {children}
    </UserContext.Provider>
  );
};