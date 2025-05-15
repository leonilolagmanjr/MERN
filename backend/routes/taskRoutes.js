const express = require('express');
const authenticate = require('../middleware/authenticate');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Route to Post Task
router.post('/post', authenticate(), taskController.postTask);

// Route to Accept Task
router.put('/accept/:taskId', authenticate(), taskController.acceptTask);

// Route to Get All Tasks
router.get('/list', taskController.getAllTasks);

// Route to Get Tasks Posted by Current User
router.get('/my-posted', authenticate(), taskController.getMyPostedTasks);

// Route to Get Tasks Completed by Current User
router.get('/my-completed', authenticate(), taskController.getMyCompletedTasks);

// Route to Complete Task
router.put('/complete/:taskId', authenticate(), taskController.completeTask);

// Route to Edit Task
router.patch('/edit/:taskId', authenticate(), taskController.editTask);

// Route to Cancel Task
router.put('/cancel/:taskId', taskController.cancelTask);

// Route to Delete Task
router.delete('/remove/:taskId', authenticate('admin'), taskController.deleteTask);

// Route to Get Tasks Accepted by Current User
router.get('/my-accepted', authenticate(), taskController.getMyAcceptedTasks);

module.exports = router;
