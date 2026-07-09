const defaultOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
export const API_URL = import.meta.env.VITE_API_URL || `${defaultOrigin}/api`;

export const ROLE_ADMIN = 'administrador';
export const ROLE_INSTRUCTOR = 'instructor';
export const ROLE_PROFESOR = 'profesor';
export const ROLE_SECRETARIA = 'secretaria';
export const ROLE_USUARIO = 'usuario';

export const LICENSE_FILTER_OPTIONS = [
  { value: 'all', label: 'Ver todas' },
  { value: 'active', label: 'Activas' },
  { value: 'expired', label: 'Vencidas' },
  { value: 'expiring', label: 'Por vencer en 30 días' },
]

export const VEHICLE_FILTER_OPTIONS = [
  { value: 'all', label: 'Ver todos' },
  { value: 'available', label: 'Disponibles' },
  { value: 'maintenance', label: 'En mantenimiento' },
  { value: 'assigned', label: 'Asignados' },
  { value: 'unassigned', label: 'Sin asignar' },
]
