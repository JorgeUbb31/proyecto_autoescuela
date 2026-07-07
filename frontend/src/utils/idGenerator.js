/**
 * Utilidades para manejo de IDs temporales
 * Genera IDs únicos para elementos creados en el frontend
 * que aún no tienen ID del servidor
 */

let tempIdCounter = -1

/**
 * Genera un ID temporal único para elementos creados en el frontend
 * Los IDs temporales son negativos para distinguirlos de los reales
 * 
 * @returns {number} ID temporal único
 * @example
 * const id = generateTempId() // -1, -2, -3, ...
 */
export function generateTempId() {
  return tempIdCounter--
}

/**
 * Verifica si un ID es temporal (generado en el frontend)
 * 
 * @param {number} id - ID a verificar
 * @returns {boolean} true si es temporal, false si es del servidor
 * @example
 * isTempId(-1) // true
 * isTempId(1) // false
 */
export function isTempId(id) {
  return id < 0
}

/**
 * Resetea el contador de IDs temporales
 * Útil cuando se recarga la página o se hace logout
 */
export function resetTempIdCounter() {
  tempIdCounter = -1
}
