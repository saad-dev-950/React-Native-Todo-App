const express = require('express');
const { body } = require('express-validator');
const protect = require('../middleware/authMiddleware');
const {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

router.use(protect);

router.get('/', getTodos);

router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required.')
      .isLength({ max: 120 })
      .withMessage('Task title is too long.'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description is too long.'),
  ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: result.array()[0].msg });
    }
    next();
  },
  createTodo
);

router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
