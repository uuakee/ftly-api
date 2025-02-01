const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createCourse = async (req, res) => {
    try {

        const { name, description, teacherId, schoolUnitId } = req.body;

        const newCourse = await prisma.course.create({
            data: {
                name,
                description,
                teacherId,
                schoolUnitId
            }
        });

        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Erro ao criar curso:", error);
        res.status(500).json({ error: "Erro ao criar curso" });
    }
}

const listAllCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar cursos" });
    }
}

const editCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, teacherId, schoolUnitId } = req.body;

        const updatedCourse = await prisma.course.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                teacherId,
                schoolUnitId
            }
        });

        res.json(updatedCourse);
    } catch (error) {
        console.error("Erro ao editar curso:", error);
        res.status(500).json({ error: "Erro ao editar curso" });
    }
}

module.exports = {
    createCourse,
    listAllCourses,
    editCourse
}