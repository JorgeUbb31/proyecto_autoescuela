"use strict";
import Joi from "joi";

// Esquema de validación para crear licencia
export const createLicenseValidation = Joi.object({
  instructorId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El ID del instructor debe ser un número.",
      "number.positive": "El ID del instructor debe ser positivo.",
    }),
  userId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El ID de usuario debe ser un número.",
      "number.positive": "El ID de usuario debe ser positivo.",
    }),
  tipoLicencia: Joi.string()
    .required()
    .pattern(/^(A1|A2|A|B|B\+E|C1|C|C\+E|D|D\+E|AM)$/)
    .messages({
      "string.empty": "El tipo de licencia no puede estar vacío.",
      "string.pattern.base":
        "El tipo de licencia debe ser uno de: A1, A2, A, B, B+E, C1, C, C+E, D, D+E, AM.",
      "any.required": "El tipo de licencia es obligatorio.",
    }),
  numeroLicencia: Joi.string()
    .required()
    .min(8)
    .max(20)
    .pattern(/^[0-9A-Z\-]+$/)
    .messages({
      "string.empty": "El número de licencia no puede estar vacío.",
      "string.min": "El número de licencia debe tener al menos 8 caracteres.",
      "string.max": "El número de licencia no puede exceder 20 caracteres.",
      "string.pattern.base":
        "El número de licencia solo puede contener números, letras mayúsculas y guiones.",
      "any.required": "El número de licencia es obligatorio.",
    }),
  categoria: Joi.string()
    .required()
    .max(50)
    .messages({
      "string.empty": "La categoría no puede estar vacía.",
      "string.max": "La categoría no puede exceder 50 caracteres.",
      "any.required": "La categoría es obligatoria.",
    }),
  fechaEmision: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de emisión debe ser una fecha válida.",
      "any.required": "La fecha de emisión es obligatoria.",
    }),
  fechaVencimiento: Joi.date()
    .required()
    .min(Joi.ref("fechaEmision"))
    .messages({
      "date.base": "La fecha de vencimiento debe ser una fecha válida.",
      "date.min":
        "La fecha de vencimiento debe ser posterior a la fecha de emisión.",
      "any.required": "La fecha de vencimiento es obligatoria.",
    }),
  activa: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": "El estado debe ser un valor booleano.",
    }),
  imagenRuta: Joi.string()
    .allow('', null)
    .messages({
      "string.base": "La imagen debe ser un texto en formato base64.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });

// Esquema de validación para actualizar licencia
export const updateLicenseValidation = Joi.object({
  tipoLicencia: Joi.string()
    .pattern(/^(A1|A2|A|B|B\+E|C1|C|C\+E|D|D\+E|AM)$/)
    .messages({
      "string.pattern.base":
        "El tipo de licencia debe ser uno de: A1, A2, A, B, B+E, C1, C, C+E, D, D+E, AM.",
    }),
  numeroLicencia: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^[0-9A-Z\-]+$/)
    .messages({
      "string.min": "El número de licencia debe tener al menos 8 caracteres.",
      "string.max": "El número de licencia no puede exceder 20 caracteres.",
      "string.pattern.base":
        "El número de licencia solo puede contener números, letras mayúsculas y guiones.",
    }),
  categoria: Joi.string()
    .max(50)
    .messages({
      "string.max": "La categoría no puede exceder 50 caracteres.",
    }),
  fechaEmision: Joi.date()
    .messages({
      "date.base": "La fecha de emisión debe ser una fecha válida.",
    }),
  fechaVencimiento: Joi.date()
    .messages({
      "date.base": "La fecha de vencimiento debe ser una fecha válida.",
    }),
  activa: Joi.boolean()
    .messages({
      "boolean.base": "El estado debe ser un valor booleano.",
    }),
  imagenRuta: Joi.string()
    .allow('', null)
    .messages({
      "string.base": "La imagen debe ser un texto en formato base64.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
