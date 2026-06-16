"use strict";

import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { encryptPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { AppDataSource } from "../config/configDb.js";
import { SESSION_SECRET } from "../config/configEnv.js";

export async function registerUser(username, email, rut, password) {
  const userRepository = AppDataSource.getRepository(User);

  const existingEmailUser = await userRepository.findOne({
    where: { email },
  });
  if (existingEmailUser) {
    throw new Error("Correo ya registrado.");
  }

  const existingRutUser = await userRepository.findOne({ where: { rut } });
  if (existingRutUser) {
    throw new Error("Rut ya registrado.");
  }

  const existingUsernameUser = await userRepository.findOne({
    where: { username },
  });
  if (existingUsernameUser) {
    throw new Error("Nombre de usuario ya registrado.");
  }

  const userCount = await userRepository.count();

  const newUser = userRepository.create({
    username,
    email,
    rut,
    password: await encryptPassword(password),
    role: userCount === 0 ? "administrador" : "usuario"
  });

  await userRepository.save(newUser);

  const { password: _, ...dataUser } = newUser;

  return dataUser;
}

export async function loginUser(email, password) {
  const userRepository = AppDataSource.getRepository(User);

  const userFound = await userRepository.findOne({ where: { email } });
  if (!userFound) {
    // No revelar si el email existe o no por razones de seguridad
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await comparePassword(password, userFound.password);
  if (!isMatch) {
    // No revelar cuál de los datos es incorrecto
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload = {
    id: userFound.id,
    username: userFound.username,
    email: userFound.email,
    rut: userFound.rut,
    role: userFound.role,
  };

  const accessToken = jwt.sign(payload, SESSION_SECRET, { expiresIn: "1d" });

  return { accessToken };
}

export async function logoutUser() {
  return { message: "Sesión cerrada exitosamente" };
}
