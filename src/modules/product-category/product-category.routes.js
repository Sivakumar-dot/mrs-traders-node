const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { validateRequest } = require('../../middleware/validateRequest');
const {
  validateProductCategoryList,
  validateProductCategoryId,
  validateCreateProductCategory,
  validateUpdateProductCategory
} = require('./product-category.validation');
const {
  listProductCategories,
  getProductCategory,
  getProductCategoryOptions,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} = require('./product-category.controller');

const router = express.Router();

router.get('/options', getProductCategoryOptions);
router.get('/', authMiddleware, validateProductCategoryList, validateRequest, listProductCategories);
router.get('/:id', authMiddleware, validateProductCategoryId, validateRequest, getProductCategory);
router.post('/', authMiddleware, validateCreateProductCategory, validateRequest, createProductCategory);
router.put('/:id', authMiddleware, validateUpdateProductCategory, validateRequest, updateProductCategory);
router.delete('/:id', authMiddleware, validateProductCategoryId, validateRequest, deleteProductCategory);

module.exports = router;
