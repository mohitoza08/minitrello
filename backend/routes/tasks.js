const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

const STATUS_ORDER = ['todo', 'in_progress', 'done'];

function nextStatus(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)];
}

function prevStatus(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[Math.max(idx - 1, 0)];
}

// GET /api/tasks  -> fetch all tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks  -> create a task (defaults to 'todo')
router.post('/', async (req, res, next) => {
  try {
    const { title, description, assigned_to, status } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and Description are required.',
      });
    }
    const task = await Task.create({
      title,
      description,
      assigned_to: assigned_to || '',
      status: status || 'todo',
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id  -> fetch a single task
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id  -> update fields (status, title, etc.)
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, title, description, assigned_to } = req.body;
    if (status && !STATUS_ORDER.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: `Invalid status: ${status}` });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assigned_to !== undefined) task.assigned_to = assigned_to;
    if (status) task.status = status;

    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/move  -> convenience endpoint: direction = 'next' | 'prev'
router.patch('/:id/move', async (req, res, next) => {
  try {
    const { direction } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    if (direction === 'next') task.status = nextStatus(task.status);
    else if (direction === 'prev') task.status = prevStatus(task.status);
    else {
      return res
        .status(400)
        .json({ success: false, message: "direction must be 'next' or 'prev'." });
    }
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id  -> delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.json({ success: true, message: 'Task deleted.', data: task });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
