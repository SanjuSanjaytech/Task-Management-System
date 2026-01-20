const express = require('express');
const router = express.Router();


const auth = require('../middlewares/authMiddleware');
const Task = require("../models/Task")
const { extractTaskfromText } = require('../utils/gemini');

const {
    createTask, getTasks, updateTask, deleteTask, assignTask, dashboard
} = require('../controllers/taskController');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/dashboard', auth, dashboard);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.post('/:id/assign', auth, assignTask);



//  AI Route

router.post('/ai-create', auth, async (req, res) => {
    try{
        const { text } = req.body;

        
        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const aiTask = await extractTaskfromText(text);

        const task = await Task.create( {
            title: aiTask.title,
            description: aiTask.description,
            dueDate: aiTask.dueDate,
            priority: aiTask.priority,
            user: req.user._id
        })

        res.status(201).json(task)


    } catch (error) {
        console.error(error)
        res.status(500).json({messages: 'AI Task creation failed'});
    }

})

module.exports = router;
