import { useMemo } from 'react'

export function useDashboard(usuario) {
  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const getRoleDisplay = () => {
    const roleMap = {
      administrador: 'Administrador',
      instructor: 'Instructor',
      profesor: 'Profesor',
      secretaria: 'Secretaria',
      usuario: 'Usuario',
    }
    return roleMap[usuario?.role] || usuario?.role
  }

  return useMemo(() => ({
    welcomeMessage: getWelcomeMessage(),
    roleDisplay: getRoleDisplay(),
  }), [usuario?.role])
}
