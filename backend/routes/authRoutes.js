const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

function validationHandler(req, res, next) {
  const { validationResult } = require('express-validator');
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: result.array()[0].msg });
  }

  next();
}

router.post('/register', registerValidation, validationHandler, register);
router.post('/login', loginValidation, validationHandler, login);

module.exports = router;
