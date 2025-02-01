const express = require('express');
const courseController = require('../controllers/course.controller');

const router = express.Router();

router.post('/create', courseController.createCourse);
router.put('/edit/:id', courseController.editCourse);
router.get('/list', courseController.listAllCourses);

module.exports = router;