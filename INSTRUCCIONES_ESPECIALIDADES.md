# 📋 Instrucciones para Poblar Especialidades

## 🎯 Objetivo
Cargar todas las especialidades médicas en tu base de datos de Supabase para que estén disponibles durante el registro de doctores.

## 📝 Pasos para Poblar las Especialidades

### Paso 1: Configurar las Credenciales
1. Abrir el archivo `populateSpecialties.js`
2. Reemplazar las credenciales de Supabase:
   ```javascript
   const supabaseUrl = 'TU_SUPABASE_URL'
   const supabaseKey = 'TU_SUPABASE_ANON_KEY'
   ```
3. Obtener estas credenciales desde:
   - Dashboard de Supabase → Settings → API
   - Copiar "Project URL" y "anon public" key

### Paso 2: Instalar Dependencias (si no las tenés)
```bash
npm install @supabase/supabase-js
```

### Paso 3: Ejecutar el Script
```bash
node populateSpecialties.js
```

### Paso 4: Verificar el Resultado
Deberías ver en la consola:
```
🚀 Iniciando población de especialidades...
✅ Se insertaron 60 especialidades exitosamente
📋 Especialidades insertadas:
   1. Cardiología
   2. Dermatología
   ...
```

## 🔍 Cómo Funciona el Buscador de Especialidades

### En el Registro de Doctores:
1. **Seleccionar "Profesional"** en el registro
2. **Tocar "Seleccionar especialidad"**
3. **Usar la barra de búsqueda** para encontrar especialidades
4. **Ejemplos de búsqueda:**
   - Escribir "cardio" → encuentra "Cardiología", "Cirugía Cardiovascular"
   - Escribir "ped" → encuentra "Pediatría", "Endocrinología Pediátrica"
   - Escribir "cir" → encuentra "Cirugía General", "Cirugía Plástica"

### Características del Buscador:
- ✅ **Búsqueda en tiempo real**
- ✅ **Insensible a mayúsculas/minúsculas**
- ✅ **Mensaje cuando no hay resultados**
- ✅ **Limpieza automática al seleccionar**

## 📋 Lista Completa de Especialidades

### Especialidades Básicas (20):
- Cardiología, Dermatología, Endocrinología, Gastroenterología, Ginecología, Hematología, Infectología, Medicina Interna, Nefrología, Neurología, Oftalmología, Oncología, Ortopedia, Otorrinolaringología, Pediatría, Psiquiatría, Radiología, Reumatología, Traumatología, Urología

### Especialidades Avanzadas (40):
- Alergología, Anestesiología, Cirugía General, Cirugía Cardiovascular, Cirugía Plástica, Cirugía Torácica, Cirugía Vascular, Coloproctología, Dermatología Estética, Endocrinología Pediátrica, Fertilidad y Reproducción, Fisiatría, Fonoaudiología, Genética Médica, Geriatría, Hepatología, Inmunología, Medicina Deportiva, Medicina Familiar, Medicina Legal, Medicina Nuclear, Medicina Preventiva, Medicina del Trabajo, Neumonología, Neurocirugía, Nutrición, Obstetricia, Odontología, Oftalmología Pediátrica, Oncología Pediátrica, Ortopedia y Traumatología, Patología, Psicología, Psicopedagogía, Terapia Ocupacional, Toxicología, Trasplantes, Urgencias Médicas, Vascular Periférico

## ⚠️ Notas Importantes

1. **Solo ejecutar una vez**: El script verifica si ya existen especialidades y no las duplica
2. **Credenciales seguras**: No compartir las credenciales de Supabase
3. **Backup**: Hacer backup de la base de datos antes de ejecutar (opcional)
4. **Eliminar script**: Después de poblar las especialidades, podés eliminar el archivo `populateSpecialties.js`

## 🚀 Probar la Funcionalidad

1. **Ejecutar la aplicación**: `npx expo start --web`
2. **Ir a "Registrarse"**
3. **Seleccionar "Profesional"**
4. **Tocar "Seleccionar especialidad"**
5. **Probar la búsqueda** escribiendo diferentes términos
6. **Seleccionar una especialidad** y verificar que se guarda correctamente

## 🔧 Solución de Problemas

### Error: "No se encontraron especialidades"
- Verificar que el script se ejecutó correctamente
- Revisar las credenciales de Supabase
- Verificar que la tabla `especialidades` existe en la base de datos

### Error: "Network request failed"
- Verificar conexión a internet
- Revisar las credenciales de Supabase
- Verificar que la URL de Supabase es correcta

### Error: "Permission denied"
- Verificar que la API key tiene permisos de lectura/escritura
- Revisar las políticas de seguridad de Supabase

---

**¡Listo! Una vez que ejecutes el script, las especialidades estarán disponibles en el registro de doctores con búsqueda funcional.**
