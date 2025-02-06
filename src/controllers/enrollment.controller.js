// src/controllers/enrollment.controller.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createEnrollment = async (req, res) => {
    try {
        const { userId, courseId, schoolId } = req.body;

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: parseInt(userId, 10),
                schoolId: parseInt(schoolId, 10),
                courses: {
                    connect: (Array.isArray(courseId) ? courseId : [courseId]).map(id => ({ id: parseInt(id, 10) }))
                }
            }
        });

        res.status(201).json(enrollment);
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

