const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/contracts';
        // Criar diretório se não existir
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const createContract = async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "Arquivo do contrato é obrigatório" });
        }

        const contract = await prisma.contract.create({
            data: {
                userId: parseInt(userId),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                fileUrl: file.path,
                fileName: file.originalname,
            }
        });

        res.status(201).json(contract);
    } catch (error) {
        console.error("Erro ao criar contrato:", error);
        res.status(500).json({ error: "Erro ao criar contrato" });
    }
};

const getContractsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const contracts = await prisma.contract.findMany({
            where: {
                userId: parseInt(userId)
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(contracts);
    } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        res.status(500).json({ error: "Erro ao buscar contratos" });
    }
};

const getContracts = async (req, res) => {
    try {
        const contracts = await prisma.contract.findMany();
        res.json(contracts);
    } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        res.status(500).json({ error: "Erro ao buscar contratos" });
    }
};

const downloadContract = async (req, res) => {
    try {
        const { id } = req.params;
        
        const contract = await prisma.contract.findUnique({
            where: { id: parseInt(id) }
        });

        if (!contract) {
            return res.status(404).json({ error: "Contrato não encontrado" });
        }

        res.download(contract.fileUrl, contract.fileName);
    } catch (error) {
        console.error("Erro ao baixar contrato:", error);
        res.status(500).json({ error: "Erro ao baixar contrato" });
    }
};

// Deletar contrato
const deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.contract.delete({ where: { id: parseInt(id) } });
        res.status(204).json({ message: "Contrato deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar contrato:", error);
        res.status(500).json({ error: "Erro ao deletar contrato" });
    }
};

module.exports = {
    upload,
    createContract,
    getContractsByUser,
    downloadContract,
    getContracts,
    deleteContract
}; 