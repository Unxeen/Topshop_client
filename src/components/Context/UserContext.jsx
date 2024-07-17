// UserContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={[ user, setUser ]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
