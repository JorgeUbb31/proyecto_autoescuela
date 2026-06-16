"use strict";

import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";
import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  try {
    const { username, rut, email, password } = req.body;
    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const dataUser = await authService.registerUser(username, email, rut, password);

    res
      .status(201)
      .json({ message: "Usuario registrado exitosamente!", data: dataUser });
  } catch (error) {
    console.error("Error en auth.controller.js -> register(): ", error);
    
    // Manejar errores específicos
    if (error.message.includes("ya registrado")) {
      return res.status(409).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { accessToken } = await authService.loginUser(email, password);

    res.status(200).json({ message: "Inicio de sesión exitoso", accessToken });
  } catch (error) {
    console.error("Error en auth.controller.js -> login(): ", error);
    
    // Mensaje genérico para login fallido (por razones de seguridad)
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

export async function logout(req, res) {
  try {
    const result = await authService.logoutUser();
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en auth.controller.js -> logout(): ", error);
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
}
