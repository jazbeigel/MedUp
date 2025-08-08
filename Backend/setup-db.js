import { PrismaClient } from "@prisma/client";
import { config } from "./config.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
});

async function setupDatabase() {
  try {
    console.log('🔧 Configurando base de datos...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Verificar si existen especialidades
    const especialidades = await prisma.especialidades.findMany();
    console.log(`📋 Especialidades encontradas: ${especialidades.length}`);
    
    if (especialidades.length === 0) {
      console.log('⚠️ No se encontraron especialidades. Verificá que la tabla esté poblada.');
    } else {
      console.log('📝 Primeras 3 especialidades:', especialidades.slice(0, 3).map(e => e.nombre));
    }
    
    // Verificar estructura de tablas
    console.log('🔍 Verificando estructura de tablas...');
    
    const pacientesCount = await prisma.pacientes.count();
    const profesionalesCount = await prisma.profesionales.count();
    
    console.log(`👥 Pacientes en la base de datos: ${pacientesCount}`);
    console.log(`👨‍⚕️ Profesionales en la base de datos: ${profesionalesCount}`);
    
    console.log('✅ Configuración de base de datos completada');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
    console.log('💡 Verificá que:');
    console.log('   1. La URL de la base de datos sea correcta');
    console.log('   2. Las credenciales sean válidas');
    console.log('   3. La base de datos esté accesible');
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
