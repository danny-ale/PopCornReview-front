import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Registro from './Pages/Registro';
import Imagenes from './Pages/Imagenes';
import Home from './Pages/Home';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return(
  <BrowserRouter>
    <Routes>
    <Route path='/Home' element={<Home/>}></Route>
    <Route path='/Registro' element={<Registro/>}></Route>
    <Route path='/Imagenes' element={<Imagenes/>}></Route>
    <Route path='/' element={<Home/>}></Route>
    </Routes>
    <ToastContainer />
  </BrowserRouter>
  
  )
}

export default App;
