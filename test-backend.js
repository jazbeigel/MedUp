// Script de prueba para verificar el backend
const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('🧪 Probando conexión con el backend...');
    
    // Probar endpoint de especialidades
    const especialidadesResponse = await fetch('http://localhost:3000/especialidades');
    console.log('📋 Estado de especialidades:', especialidadesResponse.status);
    
    if (especialidadesResponse.ok) {
      const especialidades = await especialidadesResponse.json();
      console.log('✅ Especialidades cargadas:', especialidades.length);
      console.log('📝 Primeras 3 especialidades:', especialidades.slice(0, 3));
    } else {
      console.log('❌ Error al cargar especialidades');
    }
    
    // Probar endpoint de registro (solo verificar que responde)
    const testData = {
      email: 'test@test.com',
      password: 'test123',
      nombre_completo: 'Test User',
      telefono: '123456789',
      tipo_usuario: 'paciente',
      fecha_nacimiento: '1990-01-01',
      dni: '12345678',
      direccion: 'Test Address'
    };
    
    const registerResponse = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📝 Estado de registro:', registerResponse.status);
    
    if (registerResponse.ok) {
      const result = await registerResponse.json();
      console.log('✅ Registro funcionando:', result.message);
    } else {
      const error = await registerResponse.json();
      console.log('❌ Error en registro:', error.error);
    }
    
  } catch (error) {
    console.error('❌ Error conectando con el backend:', error.message);
    console.log('💡 Asegúrate de que el backend esté ejecutándose en http://localhost:3000');
  }
}

testBackend();
