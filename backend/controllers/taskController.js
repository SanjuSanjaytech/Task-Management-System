const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTasks = async (req, res) => {
    const { search, status, priority, dueDate } = req.query;

    let query = {
        $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    };

    if (search) {
        query.$and = [{ title: { $regex: search, $options: 'i' } }];
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    try {
        const tasks = await Task.find(query).populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.assignTask = async (req, res) => {
    const { userId } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { assignedTo: userId },
            { new: true }
        );

        await Notification.create({
            user: userId,
            message: `You have been assigned a new task: ${task.title}`,
        });

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.dashboard = async (req, res) => {
    try {
        const tasksAssigned = await Task.find({ assignedTo: req.user._id });
        const tasksCreated = await Task.find({ createdBy: req.user._id });
        const overdueTasks = await Task.find({
            assignedTo: req.user._id,
            dueDate: { $lt: new Date() },
            status: { $ne: 'Completed' },
        });
        res.json({ tasksAssigned, tasksCreated, overdueTasks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
