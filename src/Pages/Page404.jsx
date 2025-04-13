import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mt-5 text-center">
      <h1>404 - Página no encontrada</h1>
      <p>Serás redirigido a la página de inicio en breve...</p>
    </div>
  );
};

export default NotFound;