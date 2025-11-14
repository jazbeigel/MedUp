import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

function Formulario({ onAgregarTarea }) {
  const [nombre, setNombre] = useState("")
  const [mail, setMail] = useState("")
  const [sintomas, setSintomas] = useState("")
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [especialidad, setEspecialidad] = useState("")
  const [idMedico, setidMedico] = useState("")
  const [idPaciente, setpaciente] = useState("")
  const [especialidades, setEspecialidades] = useState([])

  const API_PORT = 3000

  const API_BASE_URL =
    Platform.OS === 'web'
      ? `http://${window.location.hostname}:${API_PORT}`
      : Platform.OS === 'android'
      ? `http://10.0.2.2:${API_PORT}`
      : `http://localhost:${API_PORT}`

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const url = `${API_BASE_URL}/api/especialidades`
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const contentType = response.headers.get('content-type') ?? ''
        if (!contentType.includes('application/json'))
          throw new Error('Respuesta inválida')

        const data = await response.json()
        setEspecialidades(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al obtener especialidades', error)
        setEspecialidades([])
      }
    }

    fetchEspecialidades()
  }, [])

  const tomarValores = (e) => {
    e.preventDefault()

    if (!nombre || !mail || !sintomas || !fecha || !hora || !especialidad) {
      alert("Por favor completá todos los campos.")
      return
    }

    onAgregarTarea({
      nombre,
      mail,
      sintomas,
      especialidad,
      fecha,
      hora
    })
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Nueva Cita Médica</h2>

      <form onSubmit={tomarValores} className="form-card">

        <input
          className="input"
          type="text"
          placeholder="Nombre completo"
          onChange={e => setNombre(e.target.value)}
        />

        <input
          className="input"
          type="email"
          placeholder="Correo electrónico"
          onChange={e => setMail(e.target.value)}
        />

        <input
          className="input"
          type="date"
          onChange={e => setFecha(e.target.value)}
        />

        <input
          className="input"
          type="time"
          onChange={e => setHora(e.target.value)}
        />

        <select
          className="input"
          value={especialidad}
          onChange={e => setEspecialidad(e.target.value)}
        >
          <option value="">Seleccioná una especialidad</option>
          {especialidades.map(esp => (
            <option key={esp.id} value={esp.nombre}>
              {esp.nombre}
            </option>
          ))}
        </select>

        <textarea
          className="textarea"
          placeholder="Describí tus síntomas"
          rows="4"
          onChange={e => setSintomas(e.target.value)}
        />

        <button type="submit" className="button">Enviar solicitud</button>
      </form>

      {/* ESTILOS */}
      <style>
        {`
        * {
          font-family: 'Inter', sans-serif;
        }

        /* ANCHO REAL TIPO CELULAR */
        .form-container {
          width: 320px;
          margin: 0 auto;
          padding: 10px;
          background-color: #F5F7FF;
          text-align: center;
        }

        .form-title {
          font-size: 20px;
          color: #1A1A6E;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .form-card {
          width: 100%;
          background: #ffffff;
          padding: 15px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* CAMPOS FINITOS Y CHICOS */
        .input {
          width: 100%;
          height: 36px;        /* MÁS FINITO */
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 14px;     /* LETRA CHICA */
        }

        .textarea {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #ccc;
          padding: 8px 10px;
          font-size: 14px;
        }

        .button {
          width: 100%;
          height: 40px;         /* MÁS BAJITO */
          background-color: #1A1A6E;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 5px;
        }
        `}
      </style>
    </div>
  )
}

export default Formulario
