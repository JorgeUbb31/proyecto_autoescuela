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
      console.log("Base de datos ya contiene datos. Verificando datos de prueba específicos...");

      const seedEmail = "jorgediaz.diaz4@gmail.com";
      const existingUsers = await connection.query(
        "SELECT id, rut, email FROM users WHERE email = $1",
        [seedEmail]
      );
      const existingUser = existingUsers[0];

      let jorgeUser = existingUser;
      if (!jorgeUser) {
        const hashedPassword = await encryptPassword("Jorge2026!");
        const insertedUsers = await connection.query(
          `INSERT INTO users (username, rut, email, password, role)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, username, email, rut, role`,
          ["jorge_diaz", "20.123.456-7", seedEmail, hashedPassword, "usuario"]
        );
        jorgeUser = insertedUsers[0];
        console.log("Usuario de prueba creado:", seedEmail);
      } else {
        console.log("Usuario de prueba ya existe:", seedEmail);
      }

      const existingInstructors = await connection.query(
        "SELECT id FROM instructores WHERE correo = $1 OR user_id = $2",
        [seedEmail, jorgeUser.id]
      );
      const existingInstructor = existingInstructors[0];

      if (!existingInstructor) {
        await connection.query(
          `INSERT INTO instructores (user_id, rut, especializacion, correo, anos_experiencia, telefono, activo)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [jorgeUser.id, jorgeUser.rut, "Licencias y documentación", seedEmail, 1, "+56955512345", true]
        );
        console.log("Instructor de prueba creado para:", seedEmail);
      } else {
        console.log("Instructor de prueba ya existe para:", seedEmail);
      }

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
      {
        username: "jorge_diaz",
        rut: "20.123.456-7",
        email: "jorgediaz.diaz4@gmail.com",
        password: "Jorge2026!",
        role: "usuario",
      },
    ];

    // Hash de todas las contraseñas
    const usuariosConPassword = await Promise.all(
      usuarios.map(async (u) => ({
        ...u,
        hashedPassword: await encryptPassword(u.password),
      }))
    );

    // Insertar todos los usuarios con una sola query
    const usuariosValues = usuariosConPassword
      .map((_, idx) => {
        const baseIdx = idx * 5;
        return `($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4}, $${baseIdx + 5})`;
      })
      .join(", ");

    const usuariosParams = usuariosConPassword.flatMap(u => [
      u.username,
      u.rut,
      u.email,
      u.hashedPassword,
      u.role,
    ]);

    const usuariosResults = await connection.query(
      `INSERT INTO users (username, rut, email, password, role)
       VALUES ${usuariosValues} RETURNING id, username, email, rut, role`,
      usuariosParams
    );

    const usuariosCreados = usuariosResults.map((result, idx) => ({
      id: result.id,
      username: result.username,
      email: result.email,
      rut: result.rut,
      role: result.role,
    }));

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
      {
        userId: usuariosCreados[5].id,
        rut: usuariosCreados[5].rut,
        especializacion: "Licencias y documentación",
        correo: "jorgediaz.diaz4@gmail.com",
        anosExperiencia: 1,
        telefono: "+56955512345",
        activo: true,
      },
    ];

    // Insertar todos los instructores con una sola query
    const instructoresValues = instructoresData
      .map((_, idx) => {
        const baseIdx = idx * 7;
        return `($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4}, $${baseIdx + 5}, $${baseIdx + 6}, $${baseIdx + 7})`;
      })
      .join(", ");

    const instructoresParams = instructoresData.flatMap(i => [
      i.userId,
      i.rut,
      i.especializacion,
      i.correo,
      i.anosExperiencia,
      i.telefono,
      i.activo,
    ]);

    const instructoresResults = await connection.query(
      `INSERT INTO instructores (user_id, rut, especializacion, correo, anos_experiencia, telefono, activo)
       VALUES ${instructoresValues} RETURNING id, rut`,
      instructoresParams
    );

    const instructoresCreados = instructoresResults.map((result, idx) => ({
      id: result.id,
      ...instructoresData[idx],
    }));

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

    // Insertar todos los vehículos con una sola query
    const vehiculosValues = vehiculosData
      .map((_, idx) => {
        const baseIdx = idx * 9;
        return `($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4}, $${baseIdx + 5}, $${baseIdx + 6}, $${baseIdx + 7}, $${baseIdx + 8}, $${baseIdx + 9})`;
      })
      .join(", ");

    const vehiculosParams = vehiculosData.flatMap(v => [
      v.matricula,
      v.marca,
      v.modelo,
      v.ano,
      v.tipo,
      v.transmision,
      v.vencimientoPatente,
      v.vencimientoRevisionTecnica,
      v.disponible,
    ]);

    const vehiculosResults = await connection.query(
      `INSERT INTO vehiculos (matricula, marca, modelo, ano, tipo, transmision, vencimiento_patente, vencimiento_revision_tecnica, disponible)
       VALUES ${vehiculosValues} RETURNING id`,
      vehiculosParams
    );

    const vehiculosCreados = vehiculosResults.map((result, idx) => ({
      id: result.id,
      ...vehiculosData[idx],
    }));

    console.log("Vehículos creados:", vehiculosCreados.length);

    // Asignar vehículos a instructores con una sola query
    const asignacionesVehiculos = [
      { instructorId: instructoresCreados[0].id, vehiculoId: vehiculosCreados[0].id },
      { instructorId: instructoresCreados[0].id, vehiculoId: vehiculosCreados[1].id },
      { instructorId: instructoresCreados[1].id, vehiculoId: vehiculosCreados[2].id },
      { instructorId: instructoresCreados[1].id, vehiculoId: vehiculosCreados[3].id },
    ];

    const valuesPlaceholders = asignacionesVehiculos
      .map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`)
      .join(", ");
    
    const flatValues = asignacionesVehiculos.flatMap(a => [a.instructorId, a.vehiculoId]);

    await connection.query(
      `INSERT INTO instructor_vehiculos (instructor_id, vehiculo_id) VALUES ${valuesPlaceholders}`,
      flatValues
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
      {
        instructorId: instructoresCreados[2].id,
        tipoLicencia: "B",
        numeroLicencia: "LIC005",
        categoria: "Automóviles",
        fechaEmision: "2024-07-10",
        fechaVencimiento: "2026-08-05",
        lugarEmision: "Santiago",
        activa: true,
      },
      {
        instructorId: instructoresCreados[2].id,
        tipoLicencia: "A2",
        numeroLicencia: "LIC006",
        categoria: "Motocicletas",
        fechaEmision: "2025-01-20",
        fechaVencimiento: "2027-01-20",
        lugarEmision: "Santiago",
        activa: true,
      },
    ];

    // Insertar todas las licencias con una sola query
    const licenciasValues = licenciasData
      .map((_, idx) => {
        const baseIdx = idx * 8;
        return `($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4}, $${baseIdx + 5}, $${baseIdx + 6}, $${baseIdx + 7}, $${baseIdx + 8})`;
      })
      .join(", ");

    const licenciasParams = licenciasData.flatMap(l => [
      l.instructorId,
      l.tipoLicencia,
      l.numeroLicencia,
      l.categoria,
      l.fechaEmision,
      l.fechaVencimiento,
      l.lugarEmision,
      l.activa,
    ]);

    await connection.query(
      `INSERT INTO licencias (instructor_id, tipo_licencia, numero_licencia, categoria, fecha_emision, fecha_vencimiento, lugar_emision, activa)
       VALUES ${licenciasValues}`,
      licenciasParams
    );

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
    console.log("  Secretaria: sofia.secretaria@autoescuela.cl / Secretaria123!");    console.log("  Usuario: luis.usuario@autoescuela.cl / Usuario123!");
    console.log("  Usuario: jorgediaz.diaz4@gmail.com / Jorge2026!");  } catch (error) {
    console.error("Error inicializando base de datos:", error.message);
    throw error;
  }
};
