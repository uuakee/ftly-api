const express = require('express');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

router.post('/create-installments', paymentController.createInstallments);
router.get('/get-installments/:userId', paymentController.getInstallmentsFromUser);
router.get('/get-all-installments', paymentController.getAllInstallments);
router.patch('/:paymentId/status', paymentController.updatePaymentStatus);

module.exports = router;