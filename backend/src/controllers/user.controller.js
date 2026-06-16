"use strict";
import * as userService from "../services/user.service.js";

export async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ message: "Usuarios encontrados: ", data: users });
  } catch (error) {
    console.error("Error en user.controller.js -> getUsers(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getPublicUsers(req, res) {
  try {
    const publicUsers = await userService.getPublicUsers();
    res.status(200).json(publicUsers);
  } catch (error) {
    console.error("Error en user.controller.js -> getPublicUsers(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function changeUserRole(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const updateData = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const updatedUser = await userService.updateUserRole(userId, updateData.role);

    res.status(200).json({ 
      message: "Usuario actualizado correctamente",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error en user.controller.js -> changeUserRole(): ", error);
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("inválido")) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

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
    const { id } = req.params;
    const { username, email, rut } = req.body;
    
    const user = await userService.updateUser(id, { username, email, rut });

    res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente.", data: user });
  } catch (error) {
    console.error("Error en user.controller.js -> updateUserById(): ", error);
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("ya está")) {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);

    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error en user.controller.js -> deleteUserById(): ", error);
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getProfile(req, res) {
  try {
    const userEmail = req.user.email;
    const formattedUser = await userService.getUserProfile(userEmail);
    
    if (!formattedUser) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    res.status(200).json({ message: "Perfil encontrado: ", data: formattedUser });
  } catch (error) {
    console.error("Error en user.controller -> getProfile(): ", error);
    res.status(500).json({ message: "Error interno del servidor"})
  }
}