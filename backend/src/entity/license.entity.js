"use strict";

import { EntitySchema } from "typeorm";

export const LicenseEntity = new EntitySchema({
    name: "Licencia",
    tableName: "licencias",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        instructorId: {
            type: Number,
            nullable: false,
        },
        tipoLicencia: {
            type: String,
            nullable: false,
            comment: "Tipo de licencia: A1, A2, A, B, B+E, C1, C, D, D+E, AM, etc.",
        },
        numeroLicencia: {
            type: String,
            unique: true,
            nullable: false,
            comment: "Número único de licencia",
        },
        categoria: {
            type: String,
            nullable: false,
            comment: "Categoría de vehículos permitidos",
        },
        fechaEmision: {
            type: "date",
            nullable: false,
            comment: "Fecha de emisión de la licencia",
        },
        fechaVencimiento: {
            type: "date",
            nullable: false,
            comment: "Fecha de vencimiento de la licencia",
        },
        lugarEmision: {
            type: String,
            nullable: true,
            comment: "Lugar de emisión de la licencia",
        },
        activa: {
            type: Boolean,
            default: true,
            comment: "La licencia es válida y activa",
        },
        reminderSentAt: {
            type: "timestamp",
            nullable: true,
            comment: "Fecha en que se envió el recordatorio de renovación de licencia",
        },
        imagenRuta: {
            type: String,
            nullable: true,
            comment: "Ruta o nombre del archivo de imagen de la licencia",
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        instructor: {
            target: "Instructor",
            type: "many-to-one",
            joinColumn: { name: "instructorId" },
            onDelete: "CASCADE",
        },
    },
});

export default LicenseEntity;
