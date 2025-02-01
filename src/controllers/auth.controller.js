const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "cc71eda2e7b4de8f69db9cf3db40223b5da8283d6181bd08832141a2980ee7aa";

// Registrar novo usuário
const register = async (req, res) => {
    try {
        const { name, email, password, adress, role } = req.body;

        // Verificação básica dos campos obrigatórios
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
                role: role || "STUDENT" 
            }
        });

        res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
};


// Login de usuário
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca usuário no banco
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: "Email ou senha incorretos" });

        // Compara senha digitada com hash armazenado
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Email ou senha incorretos" });

        // Gera token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: "30d" }
        );

        res.json({ 
            message: "Login bem-sucedido", 
            token,
            role: user.role
        });
    } catch (error) {
        console.log("Erro ao fazer login:", error);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
};

// Verifica usuário autenticado
const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar informações do usuário" });
    }
};

module.exports = { register, login, me };
