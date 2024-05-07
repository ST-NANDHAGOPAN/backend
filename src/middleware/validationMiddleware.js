const { body, validationResult } = require('express-validator');

exports.validateRequest = (schema) => {
  switch (schema) {
    case 'login':
      return [
        body('email').notEmpty().trim().isEmail().normalizeEmail().withMessage('Enter a Valid email'),
        body('password').notEmpty().trim().escape().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
      ];
    case 'createuser':
      return [
        body('name').notEmpty().trim().escape().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('age').notEmpty().isInt({ min: 1 }).withMessage('Age must be a positive integer'),
        body('email').notEmpty().trim().isEmail().normalizeEmail(),
        body('address').notEmpty().trim().escape().isLength({ min: 5 }).withMessage('Address must be at least 5 characters long'),
      ];
    default:
      throw new Error('Invalid schema');
  }
};

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
