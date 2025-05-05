const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const {
    createTask, getTasks, updateTask, deleteTask, assignTask, dashboard
} = require('../controllers/taskController');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/dashboard', auth, dashboard);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.post('/:id/assign', auth, assignTask);

module.exports = router;
