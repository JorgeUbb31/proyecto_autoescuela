"use strict";
import Joi from "joi";

// Esquema de validación para crear instructor
export const createInstructorValidation = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del usuario debe ser un número.",
      "number.positive": "El ID del usuario debe ser positivo.",
      "any.required": "El ID del usuario es obligatorio.",
    }),
  especializacion: Joi.string()
    .max(100)
    .messages({
      "string.max": "La especialización no puede exceder 100 caracteres.",
    }),
  anosExperiencia: Joi.number()
    .integer()
    .min(0)
    .max(70)
    .default(0)
    .messages({
      "number.base": "Los años de experiencia deben ser un número.",
      "number.min": "Los años de experiencia no pueden ser negativos.",
      "number.max": "Los años de experiencia no pueden exceder 70.",
    }),
  telefono: Joi.string()
    .pattern(/^(\+?56)?(\s?9\s?)?(\s?\d{4}\s?\d{4})$/)
    .max(20)
    .messages({
      "string.pattern.base": "El formato del teléfono es inválido.",
      "string.max": "El teléfono no puede exceder 20 caracteres.",
    }),
  activo: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "El estado debe ser un valor booleano.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });

export const updateInstructorValidation = Joi.object({
  rut: Joi.string()
    .pattern(/^\d{2}\.\d{3}\.\d{3}-[0-9kK]$/)
    .max(12)
    .messages({
      "string.pattern.base": "El formato del RUT es inválido.",
      "string.max": "El RUT no puede exceder 12 caracteres.",
    }),
  especializacion: Joi.string()
    .max(100)
    .messages({
      "string.max": "La especialización no puede exceder 100 caracteres.",
    }),
  anosExperiencia: Joi.number()
    .integer()
    .min(0)
    .max(70)
    .messages({
      "number.base": "Los años de experiencia deben ser un número.",
      "number.min": "Los años de experiencia no pueden ser negativos.",
      "number.max": "Los años de experiencia no pueden exceder 70.",
    }),
  telefono: Joi.string()
    .pattern(/^(\+?56)?(\s?9\s?)?(\s?\d{4}\s?\d{4})$/)
    .max(20)
    .messages({
      "string.pattern.base": "El formato del teléfono es inválido.",
      "string.max": "El teléfono no puede exceder 20 caracteres.",
    }),
  activo: Joi.boolean()
    .messages({
      "boolean.base": "El estado debe ser un valor booleano.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
