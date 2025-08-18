import React, { useState } from 'react'


function Formulario({onAgregarTarea}){
    const [nombre,setNombre]= useState("")
    const [mail,setMail]= useState("")
    const [sintomas,setSintomas]= useState("")
    const [fecha,setFecha]= useState("")
    const [hora,setHora]= useState("")


    let tomarValores=(e)=>{
        e.preventDefault()

        if (!nombre || !mail || !sintomas || !fecha || !hora) {
            alert("Por favor completá todos los campos.");
            return;
        }

        let citaObjeto=
        {
            nombre: nombre,
            mail: mail,
            sintomas: sintomas,
            fecha: fecha,
            hora: hora
        }
        onAgregarTarea(citaObjeto)
    

}

    return(
        <form onSubmit={tomarValores}>
            <label>Nombre:</label> <input type="text" name="nombre" onChange={e=> setNombre(e.target.value)}/><br/>
            <label>Mail:</label><input type="text" name="mail"onChange={e=> setMail(e.target.value)}/><br/>
            <label>Fecha</label><input type="date" name="fecha" onChange={e => setFecha(e.target.value)}/><br/>
            <label>Hora</label><input type="time" name="hora" onChange={e => setHora(e.target.value)}/><br/>
            <label>Sintomas:</label><br/>
            <textarea name="sintomas" rows="10" cols="100"onChange={e=> setSintomas(e.target.value)}>
                Escribí acá tus sintomas
            </textarea>
            <button type="submit" >Enviar</button>
        </form>
    )
}

export default Formulario;
