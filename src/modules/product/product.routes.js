const express = require('express');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { validateRequest } = require('../../middleware/validateRequest');
const {
  validateProductList,
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct
} = require('./product.validation');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('./product.controller');

const router = express.Router();

router.get('/', authMiddleware, validateProductList, validateRequest, listProducts);
router.get('/:id', authMiddleware, validateProductId, validateRequest, getProduct);
router.post('/', authMiddleware, validateCreateProduct, validateRequest, createProduct);
router.put('/:id', authMiddleware, validateUpdateProduct, validateRequest, updateProduct);
router.delete('/:id', authMiddleware, validateProductId, validateRequest, deleteProduct);

module.exports = router;
