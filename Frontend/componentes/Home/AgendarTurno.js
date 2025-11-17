import React, { useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'

const API_PORT = 3000
const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://${window.location.hostname}:${API_PORT}`
    : Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}`
    : `http://localhost:${API_PORT}`

export default function AgendarTurno({ navigation, route }) {
  const paciente = route?.params?.paciente ?? null
  const [nombre, setNombre] = useState('')
  const [mail, setMail] = useState('')
  const [sintomas, setSintomas] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [especialidadId, setEspecialidadId] = useState('')
  const [profesionalId, setProfesionalId] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [profesionales, setProfesionales] = useState([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (paciente) {
      setNombre(paciente.nombre_completo ?? '')
      setMail(paciente.email ?? '')
    }
  }, [paciente])

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/especialidades`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const contentType = response.headers.get('content-type') ?? ''
        if (!contentType.includes('application/json')) throw new Error('Respuesta inválida')
        const data = await response.json()
        setEspecialidades(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al obtener especialidades', error)
        setEspecialidades([])
      }
    }

    const fetchProfesionales = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profesionales`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const contentType = response.headers.get('content-type') ?? ''
        if (!contentType.includes('application/json')) throw new Error('Respuesta inválida')
        const data = await response.json()
        setProfesionales(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error al obtener profesionales', error)
        setProfesionales([])
      }
    }

    fetchEspecialidades()
    fetchProfesionales()
  }, [])

  const profesionalesFiltrados = useMemo(() => {
    if (!especialidadId) return profesionales
    return profesionales.filter(
      (prof) => String(prof.id_especialidad ?? '') === String(especialidadId)
    )
  }, [especialidadId, profesionales])

  const especialidadSeleccionada =
    especialidades.find((esp) => String(esp.id) === String(especialidadId))?.nombre ?? null

  const obtenerNombreEspecialidad = (id) => {
    if (!id) return null
    const esp = especialidades.find((item) => String(item.id) === String(id))
    return esp?.nombre ?? null
  }

  const tomarValores = async (e) => {
    e.preventDefault()

    if (!paciente?.id) {
      alert('No encontramos los datos del paciente. Volvé a iniciar sesión.')
      return
    }

    if (!sintomas || !fecha || !hora || !especialidadId || !profesionalId) {
      alert('Completá todos los campos requeridos.')
      return
    }

    setSending(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente_id: paciente.id,
          profesional_id: Number(profesionalId),
          fecha: `${fecha}T${hora}`,
          descripcion: sintomas,
          estado: 'pendiente',
          especialidad_id: Number(especialidadId),
        }),
      })

      const contentType = response.headers.get('content-type') ?? ''
      const payload = contentType.includes('application/json') ? await response.json() : null

      if (!response.ok) {
        const errorMessage = payload?.error ?? 'No pudimos registrar tu solicitud.'
        throw new Error(errorMessage)
      }

      alert('Solicitud enviada correctamente. En breve el profesional la verá en su panel.')
      navigation?.goBack?.()
    } catch (error) {
      console.error('Error al crear solicitud de turno', error)
      alert(error?.message ?? 'Ocurrió un error al enviar la solicitud.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="form-screen">
      <div className="form-container">
        <h2 className="form-title">Solicitá un turno</h2>

        <form onSubmit={tomarValores} className="form-card">
        <input
          className="input"
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled
        />

        <input
          className="input"
          type="email"
          placeholder="Correo electrónico"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          disabled
        />

        <input
          className="input"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <input
          className="input"
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />

        <select
          className="input"
          value={especialidadId}
          onChange={(e) => {
            setEspecialidadId(e.target.value)
            setProfesionalId('')
          }}
        >
          <option value="">Seleccioná una especialidad</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={String(esp.id)}>
              {esp.nombre}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={profesionalId}
          onChange={(e) => setProfesionalId(e.target.value)}
        >
          <option value="">Seleccioná un profesional</option>
          {profesionalesFiltrados.map((prof) => {
            const espName = obtenerNombreEspecialidad(prof.id_especialidad)
            return (
              <option key={prof.id} value={String(prof.id)}>
                {prof.nombre_completo}
                {espName ? ` - ${espName}` : ''}
              </option>
            )
          })}
        </select>

        <textarea
          className="textarea"
          placeholder="Describí tus síntomas o motivo de la consulta"
          rows="4"
          value={sintomas}
          onChange={(e) => setSintomas(e.target.value)}
        />

          <button type="submit" className="button" disabled={sending}>
            {sending ? 'Enviando...' : 'Enviar solicitud'}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigation?.goBack?.()}
          >
            Cancelar
          </button>
        </form>
      </div>

      <style>
        {`
        * {
          font-family: 'Inter', sans-serif;
        }

        .form-screen {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #dfe7ff, #f7f8ff);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .form-container {
          width: 100%;
          max-width: 460px;
          background-color: #ffffff;
          border-radius: 18px;
          padding: 26px 24px 32px;
          box-shadow: 0 20px 40px rgba(22, 46, 116, 0.12);
        }

        .form-title {
          font-size: 20px;
          color: #1A1A6E;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .form-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 720px) {
          .form-card {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .form-card .textarea,
          .form-card .button,
          .form-card .button-secondary {
            grid-column: span 2;
          }
        }

        .input {
          width: 100%;
          border: 1px solid #d6daf2;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 15px;
          background-color: #f8f9ff;
        }

        .textarea {
          width: 100%;
          border-radius: 10px;
          border: 1px solid #d6daf2;
          padding: 12px;
          font-size: 15px;
          background-color: #f8f9ff;
          min-height: 100px;
          resize: vertical;
        }

        .button {
          width: 100%;
          height: 44px;
          background-color: #1A1A6E;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 5px;
        }
        .button[disabled] {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .button-secondary {
          background-color: #fff;
          color: #1A1A6E;
          border: 1px solid #1A1A6E;
        }
        `}
      </style>
    </div>
  )
}
