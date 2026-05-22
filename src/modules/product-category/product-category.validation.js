const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateProductCategoryList = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer.')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100.')
    .toInt(),
  query('search')
    .optional()
    .isString()
    .withMessage('search must be a string.')
    .bail()
    .trim(),
  query('sortBy')
    .optional()
    .isIn(['categoryName', 'createdAt', 'updatedAt', 'isActive'])
    .withMessage('sortBy must be one of categoryName, createdAt, updatedAt, or isActive.'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc.')
];

const validateProductCategoryId = [
  param('id')
    .custom((value) => isValidObjectId(value))
    .withMessage('Invalid product category id.')
];

const validateCreateProductCategory = [
  body('categoryName')
    .exists({ checkFalsy: true })
    .withMessage('Category name is required.')
    .bail()
    .isString()
    .withMessage('Category name must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Category name is required.'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .bail()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.')
    .toBoolean()
];

const validateUpdateProductCategory = [
  ...validateProductCategoryId,
  body('categoryName')
    .exists({ checkFalsy: true })
    .withMessage('Category name is required.')
    .bail()
    .isString()
    .withMessage('Category name must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Category name is required.'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .bail()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.')
    .toBoolean()
];

module.exports = {
  validateProductCategoryList,
  validateProductCategoryId,
  validateCreateProductCategory,
  validateUpdateProductCategory
};
