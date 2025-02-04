const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');


const prisma = new PrismaClient();
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, passport, name_family, adress, role, birthday } = req.body;

        if (!name || !email || !password || !phone || !birthday) {
            return res.status(400).json({ error: "Nome, email, senha, telefone e data de nascimento são obrigatórios" });
        }

        console.log("Email recebido:", email); // Debug

        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email já registrado" });

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria usuário no banco
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                birthday: new Date(birthday),
                passport,
                name_family,
                adress,
                role: role || "STUDENT" 
            }
        });

        res.status(201).json({ message: "Usuário criado com sucesso", user: newUser, userId: newUser.id });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
}

const createTeacher = async (req, res) => {
    try {
        const { name, email, password, adress } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
        }

        console.log("Email recebido:", email); // Debug

        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email já registrado" });

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria usuário no banco
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                adress,
                role: "TEACHER" 
            }
        });

        res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
}


const getStudents = async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: {
                Payment: {
                    where: {
                        status: "PENDING"
                    }
                }
            }
        });

        const studentsWithPendingCount = students.map(student => ({
            ...student,
            pendingPayments: student.Payment.length,
            Payment: undefined // Remove o array de pagamentos da resposta
        }));

        res.json(studentsWithPendingCount);
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        res.status(500).json({ error: "Erro ao buscar alunos" });
    }
}

const getTeachers = async (req, res) => {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: "TEACHER" }
        });
        res.json(teachers);
    } catch (error) {
        console.error("Erro ao buscar professores:", error);
        res.status(500).json({ error: "Erro ao buscar professores" });
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, adress, role } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                password,
                adress,
                role
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        res.status(500).json({ error: "Erro ao editar usuário" });
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await prisma.user.delete({
            where: { 
                id: parseInt(id) 
            }
        });

        res.json(deletedUser);
    } catch (error) {
        console.error("Erro ao deletar aluno:", error);
        res.status(500).json({ error: "Erro ao deletar aluno" });
    }
}


module.exports = {
    createUser,
    getStudents,
    getTeachers,
    editUser,
    createTeacher,
    deleteStudent
}