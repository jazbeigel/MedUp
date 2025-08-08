# MedUp - Aplicación de Gestión de Turnos Médicos

## 📋 Descripción del Proyecto

MedUp es una aplicación móvil desarrollada en React Native que permite a pacientes y profesionales médicos gestionar turnos de manera eficiente. La aplicación utiliza **exclusivamente Supabase** como backend para autenticación, base de datos y gestión de datos.

## 🏗️ Arquitectura del Proyecto

### **¿Por qué usamos Supabase exclusivamente?**

1. **Base de datos en la nube**: Tu base de datos está en Supabase, no en PostgreSQL local
2. **Autenticación integrada**: Supabase maneja usuarios, contraseñas y tokens automáticamente
3. **Simplicidad**: No necesitamos Express.js ni Prisma para manejar la base de datos
4. **Escalabilidad**: Supabase se escala automáticamente
5. **Seguridad**: Supabase maneja la seguridad de manera robusta

### **Estructura de Archivos por Rol:**

```
MedUp/
├── App.js                          # Punto de entrada principal
├── Frontend/
│   ├── componentes/
│   │   ├── auth/                   # Autenticación
│   │   │   ├── LoginForm.js        # Formulario de login
│   │   │   └── Registro.js         # Registro de usuarios
│   │   ├── pacientes/              # Funcionalidades de pacientes
│   │   │   └── PacienteHomeScreen.js
│   │   ├── doctores/               # Funcionalidades de doctores
│   │   │   └── DoctorHomeScreen.js
│   │   └── Home/                   # Componentes compartidos
│   │       ├── WelcomeScreen.js    # Pantalla de bienvenida
│   │       ├── SolicitarTurno.js   # Solicitud de turnos
│   │       └── InfoScreen.js       # Información general
│   ├── utils/
│   │   └── supabaseClient.js       # Cliente de Supabase
│   └── data/
│       └── Supabase.js             # Configuración de Supabase
├── populateSpecialties.js          # Script para poblar especialidades
├── INSTRUCCIONES_ESPECIALIDADES.md # Guía para cargar especialidades
└── package.json                    # Dependencias del proyecto
```

## 🚀 Instalación y Configuración

### **Paso 1: Clonar y instalar dependencias**
```bash
# Navegar al directorio del proyecto
cd MedUp

# Instalar dependencias
npm install
```

### **Paso 2: Configurar Supabase**
La configuración de Supabase ya está lista en:
- `Frontend/utils/supabaseClient.js`
- `Frontend/data/Supabase.js`

### **Paso 3: Poblar Especialidades (IMPORTANTE)**
Antes de usar la aplicación, necesitás cargar las especialidades médicas:

1. **Configurar credenciales** en `populateSpecialties.js`
2. **Ejecutar el script**: `node populateSpecialties.js`
3. **Verificar** que se insertaron 60 especialidades

📋 Ver instrucciones detalladas en `INSTRUCCIONES_ESPECIALIDADES.md`

### **Paso 4: Ejecutar la aplicación**
```bash
# Para Android
npx expo start --android

# Para iOS
npx expo start --ios

# Para desarrollo web
npx expo start --web
```

## 📊 Base de Datos en Supabase

### **Tablas principales:**
- **`pacientes`**: Información de pacientes
- **`profesionales`**: Información de médicos
- **`turnos`**: Citas médicas
- **`especialidades`**: Especialidades médicas (60+ especialidades)

### **¿Cómo funciona la autenticación?**
1. **Registro**: Se crea un usuario en Supabase Auth y se inserta en la tabla correspondiente
2. **Login**: Se autentica con Supabase Auth y se verifica el tipo de usuario
3. **Sesión**: Supabase maneja automáticamente los tokens de sesión

## 👥 Funcionalidades Implementadas

### **Para Pacientes:**
- ✅ Registro e inicio de sesión
- ✅ Ver turnos programados
- ✅ Solicitar nuevos turnos (fecha, hora, doctor, ubicación)
- ✅ Cancelar turnos
- ✅ Ver notificaciones

### **Para Profesionales:**
- ✅ Registro e inicio de sesión
- ✅ Ver turnos asignados
- ✅ Confirmar/cancelar turnos
- ✅ Ver notificaciones de nuevos turnos
- ✅ Ver información de pacientes
- ✅ **Buscador de especialidades** durante el registro

## 🔍 Sistema de Especialidades

### **Características del Buscador:**
- ✅ **60+ especialidades médicas** pre-cargadas
- ✅ **Búsqueda en tiempo real** durante el registro
- ✅ **Filtrado inteligente** (ej: "cardio" encuentra "Cardiología")
- ✅ **Interfaz intuitiva** con modal de selección
- ✅ **Validación obligatoria** para profesionales

### **Ejemplos de Búsqueda:**
- Escribir "cardio" → encuentra "Cardiología", "Cirugía Cardiovascular"
- Escribir "ped" → encuentra "Pediatría", "Endocrinología Pediátrica"
- Escribir "cir" → encuentra "Cirugía General", "Cirugía Plástica"

## 🔧 API Endpoints (Supabase)

### **Autenticación:**
- `supabase.auth.signUp()` - Registro de usuarios
- `supabase.auth.signInWithPassword()` - Login
- `supabase.auth.signOut()` - Logout

### **Base de Datos:**
- `supabase.from('pacientes').select()` - Obtener pacientes
- `supabase.from('profesionales').select()` - Obtener profesionales
- `supabase.from('turnos').select()` - Obtener turnos
- `supabase.from('especialidades').select()` - Obtener especialidades

## 🧪 Cómo Probar la Aplicación

### **Paso 1: Poblar especialidades**
```bash
# Configurar credenciales en populateSpecialties.js
node populateSpecialties.js
```

### **Paso 2: Ejecutar la aplicación**
```bash
npx expo start --web
```

### **Paso 3: Probar registro de profesional**
1. Abrir la aplicación
2. Tocar "Registrarse"
3. Seleccionar "Profesional"
4. Completar formulario con datos de prueba:
   - Email: `doctor@test.com`
   - Contraseña: `123456`
   - Nombre: `Dr. María García`
   - Teléfono: `987654321`
   - Matrícula: `MP12345`
   - **Especialidad**: Usar el buscador para seleccionar

### **Paso 4: Probar registro de paciente**
1. Volver a la pantalla de registro
2. Seleccionar "Paciente"
3. Completar formulario:
   - Email: `paciente@test.com`
   - Contraseña: `123456`
   - Nombre: `Juan Pérez`
   - Teléfono: `123456789`
   - DNI: `12345678`
   - Dirección: `Calle Test 123`
   - Fecha nacimiento: `1990-01-01`

### **Paso 5: Probar login**
1. Ir a "Ingresar"
2. Usar las credenciales creadas
3. Verificar que navega a la home correspondiente

### **Paso 6: Probar solicitud de turno (Paciente)**
1. Login como paciente
2. Tocar "Solicitar Turno"
3. Seleccionar doctor, fecha, hora y ubicación
4. Confirmar turno

### **Paso 7: Probar notificaciones (Doctor)**
1. Login como doctor
2. Verificar que aparece el nuevo turno
3. Probar confirmar/cancelar turno

## 🔍 Solución a Errores Comunes

### **Error: "No se encontraron especialidades"**
- Verificar que el script `populateSpecialties.js` se ejecutó correctamente
- Revisar las credenciales de Supabase en el script
- Verificar que la tabla `especialidades` existe en la base de datos

### **Error: "Unable to resolve module"**
- **Causa**: Rutas de importación incorrectas
- **Solución**: Verificar que los archivos existen en las rutas especificadas

### **Error: "Network request failed"**
- **Causa**: Intentando conectar a localhost:3000
- **Solución**: La aplicación ahora usa Supabase directamente, no necesita servidor local

### **Error: "Supabase connection failed"**
- **Causa**: Credenciales de Supabase incorrectas
- **Solución**: Verificar las credenciales en `supabaseClient.js`

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React Native
- **Backend**: Supabase (Auth + Database)
- **Navegación**: React Navigation
- **Estado**: React Hooks (useState, useEffect)
- **Base de Datos**: PostgreSQL (en Supabase)

## 📱 Características de la UI

- **Diseño moderno**: Interfaz limpia y profesional
- **Navegación intuitiva**: Flujo claro entre pantallas
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Controles fáciles de usar
- **Buscador inteligente**: Para especialidades médicas

## 🚫 Funcionalidades Omitidas

- ❌ **Farmacia**: Todos los botones y funcionalidades de farmacia han sido removidos
- ❌ **Backend Express**: Ya no se usa servidor local
- ❌ **Prisma**: Ya no se usa ORM local

## 📞 Soporte

Si tenés problemas:
1. Verificar que todas las dependencias están instaladas
2. Verificar la conexión a internet
3. Verificar las credenciales de Supabase
4. Revisar la consola para errores específicos
5. Consultar `INSTRUCCIONES_ESPECIALIDADES.md` para problemas con especialidades

## 🎯 Próximos Pasos

1. **Mejorar UI**: Implementar diseño más similar al Figma
2. **Notificaciones push**: Agregar notificaciones en tiempo real
3. **Validaciones**: Mejorar validaciones de formularios
4. **Testing**: Agregar tests unitarios
5. **Deploy**: Preparar para producción

---

**¡La aplicación ahora funciona completamente con Supabase y tiene un sistema completo de especialidades médicas! 🎉**