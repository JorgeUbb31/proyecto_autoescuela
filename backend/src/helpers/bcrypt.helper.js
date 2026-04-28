"use strict";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const encryptPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error encriptando contraseña: ${error.message}`);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Error comparando contraseña: ${error.message}`);
  }
};
