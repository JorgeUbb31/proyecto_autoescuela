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
            name: "vencimiento_patente",
            type: "date",
            nullable: true,
            comment: "Fecha de vencimiento de patente",
        },
        vencimientoRevisionTecnica: {
            name: "vencimiento_revision_tecnica",
            type: "date",
            nullable: true,
            comment: "Fecha de vencimiento de revisión técnica",
        },
        disponible: {
            type: Boolean,
            default: true,
            comment: "El vehículo está disponible para clases",
        },
        requiereMantenimiento: {
            type: Boolean,
            default: false,
            comment: "El vehículo tiene un reporte de mantenimiento pendiente",
        },
        comentarioMantenimiento: {
            type: String,
            nullable: true,
            comment: "Comentario del instructor o secretaria sobre mantenimiento",
        },
        nivelVencina: {
            type: String,
            nullable: true,
            comment: "Nivel de vencina o estado de desgaste del vehículo",
        },
        enMantenimiento: {
            type: Boolean,
            default: false,
            comment: "El vehículo está fuera de servicio por mantenimiento",
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
            joinTable: {
                name: "instructor_vehiculos", // Mismo nombre que en InstructorEntity
                joinColumn: {
                    name: "vehiculoId",
                    referencedColumnName: "id",
                },
                inverseJoinColumn: {
                    name: "instructorId",
                    referencedColumnName: "id",
                },
            },
            inverseSide: "vehiculos",
        },
    },
});

export default VehicleEntity;