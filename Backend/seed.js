import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear especialidades
  const especialidades = [
    { nombre: 'Cardiología' },
    { nombre: 'Dermatología' },
    { nombre: 'Neurología' },
    { nombre: 'Oftalmología' },
    { nombre: 'Ortopedia' },
    { nombre: 'Pediatría' },
    { nombre: 'Psicología' },
    { nombre: 'Ginecología' }
  ];

  console.log('📋 Creando especialidades...');
  for (const especialidad of especialidades) {
    await prisma.especialidades.upsert({
      where: { nombre: especialidad.nombre },
      update: {},
      create: especialidad
    });
  }

  // Obtener especialidades para usar sus IDs
  const especialidadesCreadas = await prisma.especialidades.findMany();

  // Crear algunos profesionales de ejemplo
  const profesionales = [
    {
      nombre_completo: 'Dr. María González',
      matricula: 'MP12345',
      especialidad: 'Cardiología',
      telefono: '011-1234-5678',
      email: 'maria.gonzalez@medup.com',
      password: 'password123',
      id_especialidad: especialidadesCreadas.find(e => e.nombre === 'Cardiología')?.id
    },
    {
      nombre_completo: 'Dr. Carlos Rodríguez',
      matricula: 'MP67890',
      especialidad: 'Dermatología',
      telefono: '011-2345-6789',
      email: 'carlos.rodriguez@medup.com',
      password: 'password123',
      id_especialidad: especialidadesCreadas.find(e => e.nombre === 'Dermatología')?.id
    },
    {
      nombre_completo: 'Dra. Ana Martínez',
      matricula: 'MP11111',
      especialidad: 'Pediatría',
      telefono: '011-3456-7890',
      email: 'ana.martinez@medup.com',
      password: 'password123',
      id_especialidad: especialidadesCreadas.find(e => e.nombre === 'Pediatría')?.id
    }
  ];

  console.log('👨‍⚕️ Creando profesionales...');
  for (const profesional of profesionales) {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(profesional.password, 10);
    
    // Crear usuario base
    const usuario = await prisma.usuarios.create({
      data: {}
    });

    // Crear profesional
    await prisma.profesionales.create({
      data: {
        usuario_id: usuario.id,
        nombre_completo: profesional.nombre_completo,
        matricula: profesional.matricula,
        especialidad: profesional.especialidad,
        telefono: profesional.telefono,
        id_especialidad: profesional.id_especialidad,
        email: profesional.email,
        password_hash: hashedPassword
      }
    });
  }

  // Crear algunos pacientes de ejemplo
  const pacientes = [
    {
      nombre_completo: 'Juan Pérez',
      fecha_nacimiento: new Date('1990-05-15'),
      dni: '12345678',
      direccion: 'Av. Corrientes 1234, CABA',
      telefono: '011-4567-8901',
      email: 'juan.perez@email.com',
      password: 'password123'
    },
    {
      nombre_completo: 'María López',
      fecha_nacimiento: new Date('1985-08-22'),
      dni: '87654321',
      direccion: 'Belgrano 567, CABA',
      telefono: '011-5678-9012',
      email: 'maria.lopez@email.com',
      password: 'password123'
    },
    {
      nombre_completo: 'Carlos García',
      fecha_nacimiento: new Date('1992-03-10'),
      dni: '11223344',
      direccion: 'Palermo 890, CABA',
      telefono: '011-6789-0123',
      email: 'carlos.garcia@email.com',
      password: 'password123'
    }
  ];

  console.log('👤 Creando pacientes...');
  for (const paciente of pacientes) {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(paciente.password, 10);
    
    // Crear usuario base
    const usuario = await prisma.usuarios.create({
      data: {}
    });

    // Crear paciente
    await prisma.pacientes.create({
      data: {
        usuario_id: usuario.id,
        nombre_completo: paciente.nombre_completo,
        fecha_nacimiento: paciente.fecha_nacimiento,
        dni: paciente.dni,
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        email: paciente.email,
        password_hash: hashedPassword
      }
    });
  }

  // Crear algunos turnos de ejemplo
  console.log('📅 Creando turnos de ejemplo...');
  
  // Obtener IDs de pacientes y profesionales
  const pacientesCreados = await prisma.pacientes.findMany();
  const profesionalesCreados = await prisma.profesionales.findMany();

  if (pacientesCreados.length > 0 && profesionalesCreados.length > 0) {
    const turnos = [
      {
        paciente_id: pacientesCreados[0].id,
        profesional_id: profesionalesCreados[0].id,
        fecha: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
        creado_el: new Date()
      },
      {
        paciente_id: pacientesCreados[1].id,
        profesional_id: profesionalesCreados[1].id,
        fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Pasado mañana
        creado_el: new Date()
      }
    ];

    for (const turno of turnos) {
      await prisma.turnos.create({
        data: turno
      });
    }
  }

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📊 Datos creados:');
  console.log(`- ${especialidades.length} especialidades`);
  console.log(`- ${profesionales.length} profesionales`);
  console.log(`- ${pacientes.length} pacientes`);
  console.log('- 2 turnos de ejemplo');
  console.log('\n🔑 Credenciales de prueba:');
  console.log('Pacientes:');
  console.log('  - juan.perez@email.com / password123');
  console.log('  - maria.lopez@email.com / password123');
  console.log('  - carlos.garcia@email.com / password123');
  console.log('\nProfesionales:');
  console.log('  - maria.gonzalez@medup.com / password123');
  console.log('  - carlos.rodriguez@medup.com / password123');
  console.log('  - ana.martinez@medup.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
