const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/create', userController.createUser);
router.get('/students', userController.getStudents);
router.get('/teachers', userController.getTeachers);
router.put('/edit/:id', userController.editUser);
router.post('/create-teacher', userController.createTeacher);
router.delete('/student/:id', userController.deleteStudent);
router.get('/:id', userController.getUserById);

module.exports = router;