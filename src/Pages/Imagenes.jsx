import 'bootstrap/dist/css/bootstrap.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

function Imagenes() {

    const [UserData, setUserData] = useState([]);

    useEffect(
        () => {
            axios.get("http://localhost:3001/getUser", {
            }).then(
                (resp) => {
                    if (resp.data.msg === "Error"){
                        alert("Error al obtener la informacion");
                    }else if (resp.data.msg === "No info"){
                        alert("No hay usuarios registrados");
                    }else{
                        setUserData(resp.data);
                    }
                }
            )
        },[]);

    return (
        UserData.map(
            (user, key) => {
                return (
                    <div className="card" style={{width: "18rem"}}>
                    <img src={'data:image/png;base64,'+ user.PhotoUs} class="card-img-top" alt="..."></img>
                    <div class="card-body">
                        <h5 class="card-title">{user.NameUs}</h5>
                    </div>
                    </div>
                )
            }
        )
    

     );
}

export default Imagenes;