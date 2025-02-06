const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');

router.post('/', enrollmentController.createEnrollment);
router.get('/', enrollmentController.listAllEnrollments);

module.exports = router;
