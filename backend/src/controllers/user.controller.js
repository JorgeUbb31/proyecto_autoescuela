"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    res.status(200).json({ message: "Usuarios encontrados: ", data: users });
  } catch (error) {
    console.error("Error en user.controller.js -> getUsers(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getPublicUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    const publicUsers = users.map(u => ({
      id: u.id,
      nombre: u.nombre,
      username: u.username,
      email: u.email
    }));
    res.status(200).json(publicUsers);
  } catch (error) {
    console.error("Error en user.controller.js -> getPublicUsers(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function changeUserRole(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userId = parseInt(req.params.userId);
    const updateData = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    
    console.log('Usuario encontrado:', { id: user.id, currentRole: user.role });

    if (updateData.role) {
      const normalizedRole = updateData.role.toLowerCase();
      if (normalizedRole !== 'usuario' && normalizedRole !== 'administrador' && normalizedRole !== 'admin') {
        return res.status(400).json({ message: "Rol inválido. Los roles permitidos son: usuario, administrador" });
      }
      updateData.role = normalizedRole === 'admin' ? 'administrador' : normalizedRole;
    }

    const updatedUser = {
      ...user,
      role: updateData.role || user.role,
      username: updateData.username || user.username,
      email: updateData.email || user.email,
    };

    await userRepository.save(updatedUser);

    res.status(200).json({ 
      message: "Usuario actualizado correctamente",
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Error en user.controller.js -> changeUserRole(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({ message: "Usuario encontrado: ", data: user });
  } catch (error) {
    console.error("Error en user.controller.js -> getUserById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function updateUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { username, email, rut } = req.body;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.rut = rut || user.rut;

    await userRepository.save(user);

    res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente.", data: user });
  } catch (error) {
    console.error("Error en user.controller.js -> updateUserById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function deleteUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await userRepository.remove(user);

    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error en user.controller.js -> deleteUserById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userEmail = req.user.email;
    const user = await userRepository.findOne({ where: { email: userEmail } });
    
    // Si no se encuentra el usuario, devolver un error 404
    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    // Formatear la respuesta excluyendo la contraseña
    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      rut: user.rut,
      role: user.role
    };

    res.status(200).json({ message: "Perfil encontrado: ", data: formattedUser });
  } catch (error) {
    console.error("Error en user.controller -> getProfile(): ", error);
    res.status(500).json({ message: "Error interno del servidor"})
  }
}