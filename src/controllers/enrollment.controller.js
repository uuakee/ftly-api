// src/controllers/enrollment.controller.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createEnrollment = async (req, res) => {
    try {
        const { userId, courseId, schoolId } = req.body;

        // Verifica se courseId é um array e cria uma matrícula para cada curso
        const enrollments = await Promise.all(
            (Array.isArray(courseId) ? courseId : [courseId]).map(async (id) => {
                return await prisma.enrollment.create({
                    data: {
                        userId: parseInt(userId, 10),
                        courseId: parseInt(id, 10),
                        schoolId: parseInt(schoolId, 10)
                    }
                });
            })
        );

        res.status(201).json(enrollments);
    } catch (error) {
        console.error("Erro ao criar matrícula:", error);
        res.status(500).json({ error: "Erro ao criar matrícula" });
    }
}

const listAllEnrollments = async (req, res) => {
    try {
        const enrollments = await prisma.enrollment.findMany();
        res.status(200).json(enrollments);
    } catch (error) {
        console.error("Erro ao listar matrículas:", error);
        res.status(500).json({ error: "Erro ao listar matrículas" });
    }
}

module.exports = { createEnrollment, listAllEnrollments };

