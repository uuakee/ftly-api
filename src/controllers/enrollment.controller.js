// src/controllers/enrollment.controller.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createEnrollment = async (req, res) => {
    try {
    const { userId, courseId, schoolId } = req.body;

    const enrollment = await prisma.enrollment.create({
        data: {
            userId,
            courseId,
            schoolId
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

