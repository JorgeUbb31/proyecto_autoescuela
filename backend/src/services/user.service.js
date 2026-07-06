"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { mapUser, mapUsers } from "./response.mapper.js";

/**
 * Obtiene todos los usuarios de la base de datos
 */
export async function getAllUsers() {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  return mapUsers(users);
}

/**
 * Obtiene usuarios con información pública (sin datos sensibles)
 */
export async function getPublicUsers() {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();

  return mapUsers(users).map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
  }));
}

/**
 * Obtiene un usuario por su ID
 */
export async function getUserById(id) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });
  return mapUser(user);
}

/**
 * Obtiene un usuario por su email
 */
export async function getUserByEmail(email) {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: { email } });
}

/**
 * Obtiene un usuario por su RUT
 */
export async function getUserByRut(rut) {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: { rut } });
}

/**
 * Obtiene un usuario por su username
 */
export async function getUserByUsername(username) {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: { username } });
}

/**
 * Obtiene el perfil del usuario actual por email
 */
export async function getUserProfile(userEmail) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: userEmail } });

  return mapUser(user);
}

/**
 * Actualiza el rol de un usuario
 */
export async function updateUserRole(userId, newRole) {
  const userRepository = AppDataSource.getRepository(User);
  
  // Validar formato del rol
  const normalizedRole = newRole.toLowerCase();
  const validRoles = ['usuario', 'administrador', 'instructor', 'profesor', 'secretaria'];
  
  if (!validRoles.includes(normalizedRole)) {
    throw new Error(`Rol inválido. Los roles permitidos son: ${validRoles.join(', ')}`);
  }

  const user = await userRepository.findOne({ where: { id: userId } });
  
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const finalRole = normalizedRole === 'admin' ? 'administrador' : normalizedRole;
  user.role = finalRole;
  
  await userRepository.save(user);

  return mapUser(user);
}

/**
 * Actualiza información de un usuario por su ID
 */
export async function updateUser(userId, updateData) {
  const userRepository = AppDataSource.getRepository(User);
  const { username, email, rut } = updateData;

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  // Validar que email/username/rut no estén duplicados si se están actualizando
  if (email && email !== user.email) {
    const existingEmail = await userRepository.findOne({ where: { email } });
    if (existingEmail) throw new Error("El email ya está registrado.");
  }

  if (username && username !== user.username) {
    const existingUsername = await userRepository.findOne({ where: { username } });
    if (existingUsername) throw new Error("El nombre de usuario ya está registrado.");
  }

  if (rut && rut !== user.rut) {
    const existingRut = await userRepository.findOne({ where: { rut } });
    if (existingRut) throw new Error("El RUT ya está registrado.");
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.rut = rut || user.rut;

  await userRepository.save(user);

  return mapUser(user);
}

/**
 * Elimina un usuario por su ID
 */
export async function deleteUser(userId) {
  const userRepository = AppDataSource.getRepository(User);
  
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  await userRepository.remove(user);

  return mapUser(user);
}
