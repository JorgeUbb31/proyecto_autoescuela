"use strict";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { AppDataSource } from "./configDb.js";

export const initializeDatabase = async () => {
  try {
    const connection = AppDataSource;

    if (!connection.isInitialized) {
      console.log("Base de datos no inicializada en initdb");
      return;
    }

    const userCount = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );

    if (userCount[0].count > 0) {
      console.log("Base de datos ya contiene datos. Omitiendo inicialización.");
      return;
    }

    console.log("Inicializando base de datos con datos de prueba...");

    const usuarios = [
      {
        username: "admin_autoescuela",
        rut: "12.345.678-9",
        email: "admin@autoescuela.cl",
        password: "Admin123!",
        role: "administrador",
      },
      {
        username: "juan_instructor",
        rut: "15.789.456-3",
        email: "juan.instructor@autoescuela.cl",
        password: "Instructor123!",
        role: "instructor",
      },
      {
        username: "maria_profesor",
        rut: "18.456.123-7",
        email: "maria.profesor@autoescuela.cl",
        password: "Profesor123!",
        role: "profesor",
      },
      {
        username: "sofia_secretaria",
        rut: "19.654.321-2",
        email: "sofia.secretaria@autoescuela.cl",
        password: "Secretaria123!",
        role: "secretaria",
      },
      {
        username: "luis_usuario",
        rut: "16.234.567-8",
        email: "luis.usuario@autoescuela.cl",
        password: "Usuario123!",
        role: "usuario",
      },
    ];

    const usuariosCreados = [];

    for (const usuario of usuarios) {
      const hashedPassword = await encryptPassword(usuario.password);
      const result = await connection.query(
        `INSERT INTO users (username, rut, email, password, role) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [usuario.username, usuario.rut, usuario.email, hashedPassword, usuario.role]
      );
      usuariosCreados.push({
        id: result[0].id,
        ...usuario,
      });
    }

    console.log("Usuarios creados:", usuariosCreados.length);

    const instructoresData = [
      {
        userId: usuariosCreados[1].id,
        rut: usuariosCreados[1].rut,
        especializacion: "Conducción segura",
        correo: "juan.instructor@autoescuela.cl",
        anosExperiencia: 8,
        telefono: "+56912345678",
        activo: true,
      },
      {
        userId: usuariosCreados[2].id,
        rut: usuariosCreados[2].rut,
        especializacion: "Preparación teórica",
        correo: "maria.profesor@autoescuela.cl",
        anosExperiencia: 12,
        telefono: "+56987654321",
        activo: true,
      },
    ];

    const instructoresCreados = [];

    for (const instructor of instructoresData) {
      const result = await connection.query(
        `INSERT INTO instructores (user_id, rut, especializacion, correo, anos_experiencia, telefono, activo)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          instructor.userId,
          instructor.rut,
          instructor.especializacion,
          instructor.correo,
          instructor.anosExperiencia,
          instructor.telefono,
          instructor.activo,
        ]
      );
      instructoresCreados.push({
        id: result[0].id,
        ...instructor,
      });
    }

    console.log("Instructores creados:", instructoresCreados.length);

    const vehiculosData = [
      {
        matricula: "AAAA-11",
        marca: "Toyota",
        modelo: "Corolla",
        ano: 2022,
        tipo: "AUTO",
        transmision: "MANUAL",
        vencimientoPatente: "2027-06-30",
        vencimientoRevisionTecnica: "2026-12-31",
        disponible: true,
      },
      {
        matricula: "BBBB-22",
        marca: "Hyundai",
        modelo: "i30",
        ano: 2021,
        tipo: "AUTO",
        transmision: "AUTOMATICA",
        vencimientoPatente: "2027-03-31",
        vencimientoRevisionTecnica: "2026-11-30",
        disponible: true,
      },
      {
        matricula: "CCCC-33",
        marca: "Kia",
        modelo: "Cerato",
        ano: 2023,
        tipo: "AUTO",
        transmision: "MANUAL",
        vencimientoPatente: "2028-09-30",
        vencimientoRevisionTecnica: "2027-08-31",
        disponible: true,
      },
      {
        matricula: "DDDD-44",
        marca: "Nissan",
        modelo: "Sentra",
        ano: 2020,
        tipo: "AUTO",
        transmision: "AUTOMATICA",
        vencimientoPatente: "2026-12-31",
        vencimientoRevisionTecnica: "2026-10-31",
        disponible: false,
      },
    ];

    const vehiculosCreados = [];

    for (const vehiculo of vehiculosData) {
      const result = await connection.query(
        `INSERT INTO vehiculos (matricula, marca, modelo, ano, tipo, transmision, vencimiento_patente, vencimiento_revision_tecnica, disponible)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          vehiculo.matricula,
          vehiculo.marca,
          vehiculo.modelo,
          vehiculo.ano,
          vehiculo.tipo,
          vehiculo.transmision,
          vehiculo.vencimientoPatente,
          vehiculo.vencimientoRevisionTecnica,
          vehiculo.disponible,
        ]
      );
      vehiculosCreados.push({
        id: result[0].id,
        ...vehiculo,
      });
    }

    console.log("Vehículos creados:", vehiculosCreados.length);

    await connection.query(
      `INSERT INTO instructor_vehiculos (instructor_id, vehiculo_id) VALUES ($1, $2)`,
      [instructoresCreados[0].id, vehiculosCreados[0].id]
    );
    await connection.query(
      `INSERT INTO instructor_vehiculos (instructor_id, vehiculo_id) VALUES ($1, $2)`,
      [instructoresCreados[0].id, vehiculosCreados[1].id]
    );

    await connection.query(
      `INSERT INTO instructor_vehiculos (instructor_id, vehiculo_id) VALUES ($1, $2)`,
      [instructoresCreados[1].id, vehiculosCreados[2].id]
    );
    await connection.query(
      `INSERT INTO instructor_vehiculos (instructor_id, vehiculo_id) VALUES ($1, $2)`,
      [instructoresCreados[1].id, vehiculosCreados[3].id]
    );

    console.log("Vehículos asignados a instructores");

    const licenciasData = [
      {
        instructorId: instructoresCreados[0].id,
        tipoLicencia: "B",
        numeroLicencia: "LIC001",
        categoria: "Automóviles",
        fechaEmision: "2020-01-15",
        fechaVencimiento: "2030-01-15",
        lugarEmision: "Santiago",
        activa: true,
      },
      {
        instructorId: instructoresCreados[0].id,
        tipoLicencia: "C",
        numeroLicencia: "LIC002",
        categoria: "Camiones",
        fechaEmision: "2019-06-20",
        fechaVencimiento: "2029-06-20",
        lugarEmision: "Santiago",
        activa: true,
      },
      {
        instructorId: instructoresCreados[1].id,
        tipoLicencia: "B",
        numeroLicencia: "LIC003",
        categoria: "Automóviles",
        fechaEmision: "2021-03-10",
        fechaVencimiento: "2031-03-10",
        lugarEmision: "Valparaíso",
        activa: true,
      },
      {
        instructorId: instructoresCreados[1].id,
        tipoLicencia: "D",
        numeroLicencia: "LIC004",
        categoria: "Autobuses",
        fechaEmision: "2018-11-05",
        fechaVencimiento: "2028-11-05",
        lugarEmision: "Valparaíso",
        activa: true,
      },
    ];

    for (const licencia of licenciasData) {
      await connection.query(
        `INSERT INTO licencias (instructor_id, tipo_licencia, numero_licencia, categoria, fecha_emision, fecha_vencimiento, lugar_emision, activa)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          licencia.instructorId,
          licencia.tipoLicencia,
          licencia.numeroLicencia,
          licencia.categoria,
          licencia.fechaEmision,
          licencia.fechaVencimiento,
          licencia.lugarEmision,
          licencia.activa,
        ]
      );
    }

    console.log("Licencias creadas:", licenciasData.length);

    console.log("\n¡Base de datos inicializada correctamente!");
    console.log("\nDatos de prueba creados:");
    console.log(`  - Usuarios: ${usuariosCreados.length}`);
    console.log(`  - Instructores: ${instructoresCreados.length}`);
    console.log(`  - Vehículos: ${vehiculosCreados.length}`);
    console.log(`  - Licencias: ${licenciasData.length}`);
    console.log("\nCredenciales de prueba:");
    console.log("  Admin: admin@autoescuela.cl / Admin123!");
    console.log("  Instructor: juan.instructor@autoescuela.cl / Instructor123!");
    console.log("  Profesor: maria.profesor@autoescuela.cl / Profesor123!");
    console.log("  Secretaria: sofia.secretaria@autoescuela.cl / Secretaria123!");
  } catch (error) {
    console.error("Error inicializando base de datos:", error.message);
    throw error;
  }
};
