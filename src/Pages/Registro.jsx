import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import '../css/LoginPageCSS.css'
import Logo from '../Images/logo.png'


function Registro() {

  //AQUI ESTA LA LOGICA DE PETICIONES
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [image, setImage]=useState(null);
    const [birth, setBirthday]=useState(null);
    const [errors, setErrors] = useState({});
    const navg = useNavigate();


    const validateForm = () => {
      let errors = {};

      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
      if (!nameRegex.test(name.trim())) {
        errors.name = "El nombre solo debe contener letras y espacios.";
      }


      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "El correo electrónico no es válido.";
      }

    
      const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passRegex.test(pass)) {
        errors.pass = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
      }

      
      const currentDate = new Date();
      const birthDate = new Date(birth);
      if (birthDate > currentDate) {
        errors.birth = "La fecha de nacimiento no puede ser futura.";
      }

  
      const termsAccepted = document.getElementById("terms").checked;
      if (!termsAccepted) {
        errors.terms = "Debes aceptar los términos y condiciones.";
      }

      setErrors(errors);
      return Object.keys(errors).length === 0; 
    };

    const sendDatos = async (e) =>{
      e.preventDefault();

      if (!validateForm()) return; 

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', pass);
      formData.append('birthday', birth);
      if (image) formData.append('image', image);


      try {
        const response = await axios.post('http://localhost:3001/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      
          if (response.data.msg === "Registrado"){
            console.log('Success:', "Registro exitoso");
            setName("");
            setEmail("");
            setPass("");
            setBirthday("");
            setImage(null);
            document.getElementById("terms").checked = false;
           
            navg("/Home");
          } else if(response.data.msg === "Error"){
            console.error('Error:', "Error al registrar");
          }
          

      } catch (error) {
        console.error('Error:', error);
      }
    }

    const Login = async (e) =>{
      e.preventDefault();

      const loginData = {
        correo: email,
        contra: pass
    };
  

      try {
        const response = await axios.post('http://localhost:3001/login', loginData, {
          headers: {
              'Content-Type': 'application/json' 
          }
      });
  
          if (response.data.msg === "Encontrado"){
            setEmail('');
            setPass('');
            alert("Iniciando Sesion");
            navg("/Home");
          }else if(response.data.msg === "Contraseña incorrecta"){
            alert("Contraseña incorrecta");
          }
           else if(response.data.msg === "No Encontrado"){
            alert("Usuario no encontrado");
          }
          

      } catch (error) {
        console.error('Error:', error);
      }
    }


    function SwitchContent(){
      const content= document.getElementById('content');
      const registerBtn= document.getElementById('register');
      const loginBtn= document.getElementById('login');
    
      registerBtn.addEventListener('click', () =>{
        content.classList.add("active")
      });
    
      loginBtn.addEventListener('click', () =>{
        content.classList.remove("active")
      });
    }




    //AQUI ESTA EL DISEÑO
    return ( 
    <div className='body-content'>
        <div className="content justify-content-center align-items-center d-flex shadow-lg" id='content'>
          <div className='col-6 right-box'>
            <div className='logotipo'>
              <img src={Logo} alt='Logo'></img>
              <span>PopCorn & Reviews</span>
            </div>
            <div className="d-flex flex-column">
              <span className="p-2 Titles">Hola! Bienvenido a PopCorn & Reviews</span>
              <span className="SubTitles">Crea tu cuenta</span>
            </div>

            <div>
              <form onSubmit={sendDatos}>
                <div className="d-flex flex-wrap">
                  <div className="d-flex flex-column input-container col-6 px-2">
                    <span className='Text'>Nombre:</span>
                    <input onChange={(e) => setName(e.target.value)} type="text" id="InputName1" required />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                  <div className="d-flex flex-column input-container col-6 px-2">
                    <span className='Text'>Correo Electrónico:</span>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="InputEmail1" required />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="d-flex flex-column input-container col-6 px-2">
                    <span className='Text'>Contraseña:</span>
                    <input onChange={(e) => setPass(e.target.value)} type="password" id="InputPassword1" required />
                    {errors.pass && <span className="error-text">{errors.pass}</span>}
                  </div>
                  <div className="d-flex flex-column input-container col-6 px-2">
                    <span className='Text'>Fecha de nacimiento:</span>
                    <input onChange={(e) => setBirthday(e.target.value)} type="date" id="InputFechaNacimiento" required />
                    {errors.birth && <span className="error-text">{errors.birth}</span>}
                  </div>
                  <div className="d-flex flex-column input-container col-12 px-2">
                    <span className='Text'>Imagen de perfil:</span>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="InputImagenPerfil" accept="image/*" />
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <div className="p-2">
                    <input type="checkbox" id="terms" name="terms" required />
                    <label className='SubText p-2'>Yo acepto los términos y condiciones</label>
                    {errors.terms && <span className="error-text">{errors.terms}</span>}
                  </div>
                  <button type="submit" className='p-3 btn btn-danger'>Registrarme</button>
                </div>
              </form>
              <div className="d-flex flex-column">
                <div className='d-flex flex-row pt-3 justify-content-center align-items-center'>
                    <span className='SubText p-2 text-center'>Ya tienes una cuenta?</span>
                    <Button className='hidden btn border-white text-white w-10 fs-6 btn btn-dark' id='login' onClick={SwitchContent}>Inicia Sesión</Button>
                </div>
              </div>
            </div>
          </div>

          <div className='col-6 right-box'>
          <div className='logotipo'>
              <img src={Logo} alt='Logo'></img>
              <span>PopCorn & Reviews</span>
            </div>
            <div className="d-flex flex-column">
              <span className="p-2 Titles">Bienvenido de nuevo a PopCorn & Reviews</span>
              <span className="SubTitles">Inicia Sesión</span>
            </div>

            <div>
            <form onSubmit={Login}>
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column input-container">
                    <span className='Text'>Correo Electrónico:</span>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="InputEmail2" required />
                  </div>
                  <div className="d-flex flex-column input-container">
                    <span className='Text'>Contraseña:</span>
                    <input onChange={(e) => setPass(e.target.value)} type="password" id="InputPassword2" required />
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <div className="p-2">
                    <input type="checkbox" id="remember" name="remember"></input>
                    <label className='SubText p-2'>Recuerdame:</label>
                  </div>
                  <button type="submit" className='p-3 btn btn-danger'>Inicia Sesión</button>
                </div>
              </form>
              <div className="d-flex flex-column">
                <div className='d-flex flex-row pt-3 justify-content-center align-items-center'>
                    <span className='SubText p-2 text-center'>Si no tienes una cuenta puedes crear una:</span>
                    <Button className='hidden btn border-white text-white w-10 fs-6 btn btn-dark'id='register'onClick={SwitchContent}>Registrate</Button>
                </div>
              </div>
            </div>
          </div>

          <div className='switch-content'>
            <div className='switch'>
              <div className='switch-panel switch-left'>
              </div>
              <div className='switch-panel switch-right'>
              </div>
            </div>
          </div>
        </div>
    </div>

     );
}

export default Registro;