const express = require('express');
const schoolController = require('../controllers/school.controller');

const router = express.Router();

router.post('/create', schoolController.createSchool);
router.put('/edit/:id', schoolController.editSchool);
router.get('/list', schoolController.listAllSchools);

module.exports = router;