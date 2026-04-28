"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

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

