import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Registro from './Pages/Registro';
import Imagenes from './Pages/Imagenes';
import Home from './Pages/Home';
import Perfil from './Pages/PerfilUsuario';
import CrearCategoria from './Pages/CrearCategoria';
import CrearPelicula from './Pages/CrearPelicula';
import ListaReview from './Pages/ListaReviews';
import Login from './Pages/Registro';
import Result from './Pages/Result';
import MovieDetail from './Pages/MovieDetail';
import NotFound from './Pages/Page404'; 
import { ToastContainer } from "react-toastify";
import { useAuth } from './hooks/useAuth'; 
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return null; 
  }
  if (!token) {
    return <Navigate to="/Home" replace />;
  }
  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/result" element={<Result />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/movie/:userId/:movieId" element={<MovieDetail />} />


        <Route path="/Perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
        
        <Route path="/CrearCategoria" element={
          <ProtectedRoute>
            <CrearCategoria />
          </ProtectedRoute>
        } />
        
        <Route path="/CrearPelicula" element={
          <ProtectedRoute>
            <CrearPelicula />
          </ProtectedRoute>
        } />
        
        <Route path="/ListaReview" element={
          <ProtectedRoute>
            <ListaReview />
          </ProtectedRoute>
        } />
        
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}


export default App;
