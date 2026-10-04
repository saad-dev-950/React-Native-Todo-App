const mongoose = require('mongoose');
const Todo = require('../models/Todo');

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getTodos(req, res) {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({ message: 'Server error while loading tasks.' });
  }
}

async function createTodo(req, res) {
  try {
    const { title, description = '', priority = 'medium', dueDate = '' } = req.body;

    const todo = await Todo.create({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      user: req.user.id,
    });

    return res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({ message: 'Server error while creating the task.' });
  }
}

async function updateTodo(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Todo ID.' });
    }

    // Ownership check: the Todo must belong to the authenticated user.
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    const { title, description, completed, priority, dueDate } = req.body;

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = Boolean(completed);
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();

    return res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({ message: 'Server error while updating the task.' });
  }
}

async function toggleTodo(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Todo ID.' });
    }

    // Ownership check prevents toggling another user's task.
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.json(todo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    return res.status(500).json({ message: 'Server error while changing task status.' });
  }
}

async function deleteTodo(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Todo ID.' });
    }

    // The user ID is part of the delete query, so another user cannot delete it.
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    return res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({ message: 'Server error while deleting the task.' });
  }
}

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
};
