import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return(
  <BrowserRouter>
    <Routes>
    <Route path='/Home' element={<Home/>}></Route>
    <Route path='/Registro' element={<Registro/>}></Route>
    <Route path='/Imagenes' element={<Imagenes/>}></Route>
    <Route path='/Perfil' element={<Perfil/>}></Route>
    <Route path='/CrearCategoria' element={<CrearCategoria/>}></Route>
    <Route path='/CrearPelicula' element={<CrearPelicula/>}></Route>
    <Route path='/ListaReview' element={<ListaReview/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/result' element={<Result/>}></Route>
    <Route path='/movie' element={<MovieDetail/>}></Route>
    <Route path='/' element={<Home/>}></Route>
    </Routes>
    <ToastContainer />
  </BrowserRouter>
  
  )
}

export default App;
