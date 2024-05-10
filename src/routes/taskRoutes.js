const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/:userId', taskController.getTasksByUser);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);


module.exports = router;
