"use strict";

import { EntitySchema } from "typeorm";

export const VehicleEntity = new EntitySchema({
    name: "Vehiculo",
    tableName: "vehiculos",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        matricula: {
            type: String,
            unique: true,
            nullable: false,
            comment: "Patente del vehículo",
        },
        marca: {
            type: String,
            nullable: false,
            comment: "Marca del vehículo (Toyota, Nissan, etc.)",
        },
        modelo: {
            type: String,
            nullable: false,
            comment: "Modelo del vehículo",
        },
        ano: {
            type: Number,
            nullable: false,
            comment: "Año de fabricación",
        },
        tipo: {
            type: String,
            nullable: false,
            comment: "Tipo de vehículo: AUTO, CAMIONETA, CAMION, MOTO, etc.",
        },
        transmision: {
            type: String,
            nullable: true,
            comment: "Tipo de transmisión: AUTOMATICA, MANUAL",
        },
        vencimientoPatente: {
            type: "date",
            nullable: true,
            comment: "Fecha de vencimiento de patente",
        },
        vencimientoRevisionTecnica: {
            type: "date",
            nullable: true,
            comment: "Fecha de vencimiento de revisión técnica",
        },
        disponible: {
            type: Boolean,
            default: true,
            comment: "El vehículo está disponible para clases",
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
        instructores: {
            target: "Instructor",
            type: "many-to-many",
            inverseSide: "vehiculos",
        },
    },
});

export default VehicleEntity;
