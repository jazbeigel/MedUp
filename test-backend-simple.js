// Script de prueba simple para el backend
const http = require('http');

function testBackend() {
  console.log('🧪 Probando backend...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Estado: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📝 Respuesta:', data);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.log('💡 Asegúrate de que el backend esté ejecutándose en http://localhost:3001');
  });

  req.end();
}

testBackend();
