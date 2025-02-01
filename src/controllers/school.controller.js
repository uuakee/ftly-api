const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createSchool = async (req, res) => {
    try {
        const { name, desc } = req.body;

        const newSchool = await prisma.school.create({
            data: {
                name,
                desc
            }
        });

        res.status(201).json(newSchool);
    } catch (error) {
        console.error("Erro ao criar escola:", error);
        res.status(500).json({ error: "Erro ao criar escola" });
    }
};

const listAllSchools = async (req, res) => {
    try {
        const schools = await prisma.school.findMany();
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar escolas" });
    }
};

const editSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc } = req.body;

        const updatedSchool = await prisma.school.update({
            where: { id: parseInt(id) },
            data: {
                name,
                desc
            }
        });

        res.json(updatedSchool);
    } catch (error) {
        res.status(500).json({ error: "Erro ao editar escola" });
    }
};

module.exports = {
    createSchool,
    editSchool,
    listAllSchools
};