"use strict";
import Joi from "joi";

export const createVehicleValidation = Joi.object({
  matricula: Joi.string()
    .uppercase()
    .required()
    .pattern(/^[A-Z]{2}(?:-[A-Z]{2}-\d{2}|-\d{2}-\d{2})$|^[A-Z]{2,3}-\d{2}$/)
    .max(8)
    .messages({
      "string.empty": "La matrícula no puede estar vacía.",
      "string.pattern.base":
        "Formato de matrícula inválido. Ejemplos válidos: XB-00-12 para autos o TKV-43 para motos.",
      "string.max": "La matrícula no puede exceder 8 caracteres.",
      "any.required": "La matrícula es obligatoria.",
    }),
  marca: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      "string.empty": "La marca no puede estar vacía.",
      "string.min": "La marca debe tener al menos 2 caracteres.",
      "string.max": "La marca no puede exceder 50 caracteres.",
      "any.required": "La marca es obligatoria.",
    }),
  modelo: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      "string.empty": "El modelo no puede estar vacío.",
      "string.min": "El modelo debe tener al menos 2 caracteres.",
      "string.max": "El modelo no puede exceder 50 caracteres.",
      "any.required": "El modelo es obligatorio.",
    }),
  ano: Joi.number()
    .integer()
    .required()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .messages({
      "number.base": "El año debe ser un número.",
      "number.min": "El año debe ser mayor a 1900.",
      "number.max": `El año no puede ser mayor a ${new Date().getFullYear() + 1}.`,
      "any.required": "El año es obligatorio.",
    }),
  tipo: Joi.string()
    .uppercase()
    .required()
    .pattern(/^(AUTO|CAMIONETA|CAMION|MOTO)$/)
    .messages({
      "string.empty": "El tipo no puede estar vacío.",
      "string.pattern.base":
        "El tipo debe ser uno de: AUTO, CAMIONETA, CAMION, MOTO.",
      "any.required": "El tipo es obligatorio.",
    }),
  transmision: Joi.string()
    .uppercase()
    .pattern(/^(AUTOMATICA|MANUAL)$/)
    .messages({
      "string.pattern.base":
        "La transmisión debe ser: AUTOMATICA o MANUAL.",
    }),
  vencimientoPatente: Joi.date()
    .messages({
      "date.base": "La fecha de vencimiento de patente debe ser válida.",
    }),
  vencimientoRevisionTecnica: Joi.date()
    .messages({
      "date.base":
        "La fecha de vencimiento de revisión técnica debe ser válida.",
    }),
  disponible: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "La disponibilidad debe ser un valor booleano.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });


export const maintenanceVehicleValidation = Joi.object({
  comentarioMantenimiento: Joi.string().allow('', null).max(500).messages({
    "string.max": "El comentario no puede exceder 500 caracteres.",
  }),
  requiereMantenimiento: Joi.boolean().messages({
    "boolean.base": "El estado de mantenimiento debe ser un valor booleano.",
  }),
  enMantenimiento: Joi.boolean().messages({
    "boolean.base": "La decisión de mantenimiento debe ser un valor booleano.",
  }),
  nivelVencina: Joi.string().allow('', null).max(100).messages({
    "string.max": "El nivel de vencina no puede exceder 100 caracteres.",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });

export const updateVehicleValidation = Joi.object({
  matricula: Joi.string()
    .uppercase()
    .pattern(/^[A-Z]{2}(?:-[A-Z]{2}-\d{2}|-\d{2}-\d{2})$|^[A-Z]{2,3}-\d{2}$/)
    .max(8)
    .messages({
      "string.pattern.base":
        "Formato de matrícula inválido. Ejemplos válidos: XB-00-12 para autos o TKV-43 para motos.",
      "string.max": "La matrícula no puede exceder 8 caracteres.",
    }),
  marca: Joi.string()
    .min(2)
    .max(50)
    .messages({
      "string.min": "La marca debe tener al menos 2 caracteres.",
      "string.max": "La marca no puede exceder 50 caracteres.",
    }),
  modelo: Joi.string()
    .min(2)
    .max(50)
    .messages({
      "string.min": "El modelo debe tener al menos 2 caracteres.",
      "string.max": "El modelo no puede exceder 50 caracteres.",
    }),
  ano: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .messages({
      "number.base": "El año debe ser un número.",
      "number.min": "El año debe ser mayor a 1900.",
      "number.max": `El año no puede ser mayor a ${new Date().getFullYear() + 1}.`,
    }),
  tipo: Joi.string()
    .uppercase()
    .pattern(/^(AUTO|CAMIONETA|CAMION|MOTO)$/)
    .messages({
      "string.pattern.base":
        "El tipo debe ser uno de: AUTO, CAMIONETA, CAMION, MOTO.",
    }),
  transmision: Joi.string()
    .pattern(/^(AUTOMATICA|MANUAL)$/)
    .messages({
      "string.pattern.base":
        "La transmisión debe ser: AUTOMATICA o MANUAL.",
    }),
  vencimientoPatente: Joi.date()
    .messages({
      "date.base": "La fecha de vencimiento de patente debe ser válida.",
    }),
  vencimientoRevisionTecnica: Joi.date()
    .messages({
      "date.base":
        "La fecha de vencimiento de revisión técnica debe ser válida.",
    }),
  disponible: Joi.boolean()
    .messages({
      "boolean.base": "La disponibilidad debe ser un valor booleano.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
