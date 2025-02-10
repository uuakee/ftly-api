const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract.controller');

// Criar novo contrato com upload de arquivo
router.post('/create', 
    contractController.upload.single('file'), 
    contractController.createContract
);

// Buscar contratos de um usuário
router.get('/:userId', contractController.getContractsByUser);

// Buscar todos os contratos
router.get('/', contractController.getContracts);

// Download do contrato
router.get('/:id/download', contractController.downloadContract);

// Deletar contrato
router.delete('/:id', contractController.deleteContract);

module.exports = router; 