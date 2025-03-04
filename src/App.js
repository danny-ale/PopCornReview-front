import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Registro from './Pages/Registro';
import Imagenes from './Pages/Imagenes';
import Home from './Pages/Home';

function App() {
  return(
  <BrowserRouter>
    <Routes>
    <Route path='/Home' element={<Home/>}></Route>
    <Route path='/Registro' element={<Registro/>}></Route>
    <Route path='/Imagenes' element={<Imagenes/>}></Route>
    <Route path='/' element={<Home/>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App;
