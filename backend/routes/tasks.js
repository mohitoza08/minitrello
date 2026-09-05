const express = require('express');
const { supabase, TASKS_TABLE } = require('../db/supabase');

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

// Convert a raw Supabase row into the same JSON shape the frontend expects.
// (Supabase stores created_at/updated_at in snake_case; the UI uses createdAt.)
function serializeTask(row) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    assigned_to: row.assigned_to,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/tasks  -> fetch all tasks (newest first)
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const tasks = (data || []).map(serializeTask);
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

    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .insert({
        title,
        description,
        assigned_to: assigned_to || '',
        status: status || 'todo',
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: serializeTask(data) });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id  -> fetch a single task
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      throw error;
    }
    res.json({ success: true, data: serializeTask(data) });
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

    // Only include fields that were actually sent by the client.
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (status) updates.status = status;

    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      throw error;
    }
    res.json({ success: true, data: serializeTask(data) });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id/move  -> convenience endpoint: direction = 'next' | 'prev'
router.patch('/:id/move', async (req, res, next) => {
  try {
    const { direction } = req.body;

    // Supabase does not support read-after-update on a single call reliably,
    // so we fetch, compute the new status, then patch it back.
    const { data: task, error: findError } = await supabase
      .from(TASKS_TABLE)
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      throw findError;
    }

    let targetStatus;
    if (direction === 'next') targetStatus = nextStatus(task.status);
    else if (direction === 'prev') targetStatus = prevStatus(task.status);
    else {
      return res
        .status(400)
        .json({ success: false, message: "direction must be 'next' or 'prev'." });
    }

    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .update({ status: targetStatus })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data: serializeTask(data) });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id  -> delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      throw error;
    }
    res.json({ success: true, message: 'Task deleted.', data: serializeTask(data) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;