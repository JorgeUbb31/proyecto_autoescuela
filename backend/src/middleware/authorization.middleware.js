"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Carga la información completa del usuario en req.user
 */
export async function populateUser(req, res, next) {
  try {
    if (!req.user?.email) return next();
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: req.user.email });
    
    if (user) {
      req.user.id = user.id;
      req.user.role = user.role;
      console.log('Usuario autenticado:', { id: user.id, email: user.email, role: user.role }); // Para debug
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Error al cargar usuario" });
  }
}

/**
 * Verifica si el usuario tiene permisos con un array de roles permitidos
 */
export function isAuthorized(allowedRoles) {
  return async (req, res, next) => {
    try {
      const userRole = req.user?.role?.toLowerCase();

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Error al acceder al recurso. Permisos insuficientes para realizar esta acción.",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };
}

/**
 * Verifica si el usuario es administrador
 */
export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });
    if (!userFound) return res.status(404).json("Usuario no encontrado");

    const rolUser = userFound.role?.toLowerCase();

    if (rolUser !== "administrador" && rolUser !== "admin")
      return res
        .status(403)
        .json({
          message:
            "Error al acceder al recurso. Se requiere un rol de administrador para realizar esta acción.",
        });

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

/**
 * Verifica si el usuario es instructor o profesor
 */
export async function isInstructor(req, res, next) {
  try {
    const userRole = req.user?.role?.toLowerCase();

    if (userRole !== "instructor" && userRole !== "profesor") {
      return res.status(403).json({
        message: "Error al acceder al recurso. Se requiere un rol de instructor o profesor para realizar esta acción.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

/**
 * Verifica si el usuario es secretaria
 */
export async function isSecretaria(req, res, next) {
  try {
    const userRole = req.user?.role?.toLowerCase();

    if (userRole !== "secretaria") {
      return res.status(403).json({
        message: "Error al acceder al recurso. Se requiere un rol de secretaria para realizar esta acción.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

/**
 * Verifica si el usuario es usuario regular
 */
export async function isUser(req, res, next) {
  try {
    const userRole = req.user?.role?.toLowerCase();

    if (userRole !== "usuario") {
      return res.status(403).json({
        message: "Error al acceder al recurso. Se requiere un rol de usuario para realizar esta acción.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

/**
 * Verifica si el usuario es administrador o instructor
 */
export async function isAdminOrInstructor(req, res, next) {
  try {
    const userRole = req.user?.role?.toLowerCase();

    const allowedRoles = ["administrador", "admin", "instructor", "profesor"];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Error al acceder al recurso. Se requiere un rol de administrador o instructor para realizar esta acción.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

