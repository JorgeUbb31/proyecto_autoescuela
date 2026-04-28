"use strict";

import { EntitySchema } from "typeorm";

export const InstructorEntity = new EntitySchema({
    name: "Instructor",
    tableName: "instructores",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        userId: {
            type: Number,
            nullable: false,
            unique: true,
            comment: "Referencia al usuario en tabla usuarios",
        },
        rut: {
            type: String,
            unique: true,
            nullable: false,
            comment: "RUT del instructor, único",
        },
        especializacion: {
            type: String,
            nullable: true,
            comment: "Especialización del instructor",
        },
        correo: {
            type: String,
            nullable: true,
            comment: "Correo electrónico de contacto del instructor",
        },
        anosExperiencia: {
            type: Number,
            default: 0,
            comment: "Años de experiencia como instructor",
        },
        telefono: {
            type: String,
            nullable: true,
            comment: "Número de teléfono del instructor",
        },
        activo: {
            type: Boolean,
            default: true,
            comment: "Instructor activo en la autoescuela",
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
        usuario: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "userId" },
            onDelete: "CASCADE",
        },
        licencias: {
            target: "Licencia",
            type: "one-to-many",
            inverseSide: "instructor",
            cascade: true,
        },
        vehiculos: {
            target: "Vehiculo",
            type: "many-to-many",
            joinTable: {
                name: "instructor_vehiculos",
                joinColumn: {
                    name: "instructorId",
                    referencedColumnName: "id",
                },
                inverseJoinColumn: {
                    name: "vehiculoId",
                    referencedColumnName: "id",
                },
            },
        },
    },
});

export default InstructorEntity;
