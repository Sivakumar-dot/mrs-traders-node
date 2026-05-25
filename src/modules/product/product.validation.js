const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateProductList = [
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
    .isIn(['productName', 'createdAt', 'updatedAt', 'isActive'])
    .withMessage('sortBy must be one of productName, createdAt, updatedAt, or isActive.'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc.')
];

const validateProductId = [
  param('id')
    .custom((value) => isValidObjectId(value))
    .withMessage('Invalid product id.')
];

const validateCreateProduct = [
  body('productCode')
    .optional()
    .isString()
    .withMessage('productCode must be a string.')
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage('productCode must not exceed 100 characters.'),
  body('categoryId')
    .exists({ checkFalsy: true })
    .withMessage('Category is required.')
    .bail()
    .custom((value) => isValidObjectId(String(value).trim()))
    .withMessage('categoryId must be a valid MongoDB ObjectId.'),
  body('productName')
    .exists({ checkFalsy: true })
    .withMessage('Product name is required.')
    .bail()
    .isString()
    .withMessage('Product name must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Product name is required.'),
  body('brand')
    .optional()
    .isString()
    .withMessage('brand must be a string.')
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage('brand must not exceed 150 characters.'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .bail()
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('price must be a non-negative number.')
    .toFloat(),
  body('quantity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('quantity must be a non-negative number.')
    .toFloat(),
  body('uom')
    .optional()
    .isString()
    .withMessage('uom must be a string.')
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage('uom must not exceed 50 characters.'),
  body('imageUrl')
    .optional()
    .isString()
    .withMessage('imageUrl must be a string.')
    .bail()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.')
    .toBoolean()
];

const validateUpdateProduct = [
  ...validateProductId,
  body('productCode')
    .optional()
    .isString()
    .withMessage('productCode must be a string.')
    .bail()
    .trim()
    .isLength({ max: 100 })
    .withMessage('productCode must not exceed 100 characters.'),
  body('categoryId')
    .exists({ checkFalsy: true })
    .withMessage('Category is required.')
    .bail()
    .custom((value) => isValidObjectId(String(value).trim()))
    .withMessage('categoryId must be a valid MongoDB ObjectId.'),
  body('productName')
    .exists({ checkFalsy: true })
    .withMessage('Product name is required.')
    .bail()
    .isString()
    .withMessage('Product name must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Product name is required.'),
  body('brand')
    .optional()
    .isString()
    .withMessage('brand must be a string.')
    .bail()
    .trim()
    .isLength({ max: 150 })
    .withMessage('brand must not exceed 150 characters.'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .bail()
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('price must be a non-negative number.')
    .toFloat(),
  body('quantity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('quantity must be a non-negative number.')
    .toFloat(),
  body('uom')
    .optional()
    .isString()
    .withMessage('uom must be a string.')
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage('uom must not exceed 50 characters.'),
  body('imageUrl')
    .optional()
    .isString()
    .withMessage('imageUrl must be a string.')
    .bail()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean.')
    .toBoolean()
];

module.exports = {
  validateProductList,
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct
};
