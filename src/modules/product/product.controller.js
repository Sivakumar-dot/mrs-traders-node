const productService = require('./product.service');
const { successResponse } = require('../../utils/responseHandler');

const listProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);

    return res.status(200).json({
      success: true,
      data: result.data,
      totalRecords: result.totalRecords,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      requestId: req.requestId
    });
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    return successResponse({
      res,
      message: 'Product fetched successfully.',
      requestId: req.requestId,
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    return successResponse({
      res,
      statusCode: 201,
      message: 'Product created successfully.',
      requestId: req.requestId,
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    return successResponse({
      res,
      message: 'Product updated successfully.',
      requestId: req.requestId,
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);

    return successResponse({
      res,
      message: 'Product deleted successfully.',
      requestId: req.requestId,
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
