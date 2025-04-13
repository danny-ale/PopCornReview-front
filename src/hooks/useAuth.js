import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setLoading(false); 
  }, []);

  return { token, loading };
};