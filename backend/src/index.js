"use strict";
import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import { connectDB, AppDataSource } from "./config/configDb.js";
import { PORT, HOST } from "./config/configEnv.js";
import { initializeDatabase } from "./config/initdb.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(
      cors({
        credentials: true,
        origin: true,
      })
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      })
    );

    app.use(
      json({
        limit: "1mb",
      })
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    app.use("/api", indexRoutes);

    app.get("/health", (req, res) => {
      res.status(200).json({ message: "Servidor funcionando correctamente" });
    });

    app.use((req, res) => {
      res.status(404).json({ message: "Ruta no encontrada" });
    });

    app.use((err, req, res, next) => {
      console.error("Error global:", err);
      res.status(500).json({
        message: "Error interno del servidor",
        error: err.message,
      });
    });

    app.listen(PORT, HOST, () => {
      console.log(`=> Servidor corriendo en http://${HOST}:${PORT}/api`);
    });

    return app;
  } catch (error) {
    console.error(
      "Error en index.js -> setupServer(), el error es: ",
      error
    );
    throw error;
  }
}

async function setupAPI() {
  try {
    await connectDB();
    console.log("=> Base de datos conectada");

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("=> TypeORM inicializado");
    }

    await initializeDatabase();
    console.log("=> Datos iniciales cargados");

    await setupServer();
  } catch (error) {
    console.error(
      "Error en index.js -> setupAPI(), el error es: ",
      error
    );
    throw error;
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.error("Error en index.js -> setupAPI(), el error es: ", error)
  );
