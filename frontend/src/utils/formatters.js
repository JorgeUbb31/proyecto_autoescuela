/**
 * Utilidades de formato para datos comunes
 */

/**
 * Formatea fecha a formato legible
 * 
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale para formato (default 'es-ES')
 * @returns {string} Fecha formateada
 * @example
 * formatDate('2024-06-16') // "16 de junio de 2024"
 */
export function formatDate(date, locale = 'es-ES') {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatea estado booleano a texto
 * 
 * @param {boolean} value - Valor booleano
 * @returns {string} "Activo" o "Inactivo"
 */
export function formatStatus(value) {
  return value ? 'Activo' : 'Inactivo'
}

/**
 * Trunca texto a una longitud máxima
 * 
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @returns {string} Texto truncado
 * @example
 * truncateText('Lorem ipsum dolor', 10) // "Lorem ipsu..."
 */
export function truncateText(text, length) {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Capitaliza la primera letra de un string
 * 
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 * @example
 * capitalize('hola mundo') // "Hola mundo"
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
