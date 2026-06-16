/**
 * Utilidades de validación para el frontend
 */

/**
 * Valida formato de RUT chileno (XX.XXX.XXX-X)
 * 
 * @param {string} rut - RUT a validar
 * @returns {boolean} true si es válido, false si no
 * @example
 * isValidRut('12.345.678-9') // true
 * isValidRut('invalid') // false
 */
export function isValidRut(rut) {
  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/
  return rutRegex.test(rut)
}

/**
 * Valida formato de email
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 * @example
 * isValidEmail('user@example.com') // true
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida contraseña (mínimo 6 caracteres)
 * 
 * @param {string} password - Contraseña a validar
 * @returns {boolean} true si es válida
 */
export function isValidPassword(password) {
  return password && password.length >= 6
}

/**
 * Valida que dos valores sean iguales
 * 
 * @param {*} value1 - Primer valor
 * @param {*} value2 - Segundo valor
 * @returns {boolean} true si son iguales
 */
export function isEqual(value1, value2) {
  return value1 === value2
}

/**
 * Valida que un valor no esté vacío
 * 
 * @param {*} value - Valor a validar
 * @returns {boolean} true si no está vacío
 */
export function isNotEmpty(value) {
  return value !== null && value !== undefined && value !== ''
}
