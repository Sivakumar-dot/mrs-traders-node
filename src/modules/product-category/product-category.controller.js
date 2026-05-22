const productCategoryService = require('./product-category.service');
const { successResponse } = require('../../utils/responseHandler');

const listProductCategories = async (req, res, next) => {
  try {
    const result = await productCategoryService.getProductCategories(req.query);

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

const getProductCategory = async (req, res, next) => {
  try {
    const productCategory = await productCategoryService.getProductCategoryById(req.params.id);

    return successResponse({
      res,
      message: 'Product category fetched successfully.',
      requestId: req.requestId,
      data: productCategory
    });
  } catch (error) {
    return next(error);
  }
};

const getProductCategoryOptions = async (req, res, next) => {
  try {
    const productCategories = await productCategoryService.getProductCategoryOptions();

    return successResponse({
      res,
      message: 'Product category options fetched successfully.',
      requestId: req.requestId,
      data: productCategories
    });
  } catch (error) {
    return next(error);
  }
};

const createProductCategory = async (req, res, next) => {
  try {
    const productCategory = await productCategoryService.createProductCategory(req.body);

    return successResponse({
      res,
      statusCode: 201,
      message: 'Product category created successfully.',
      requestId: req.requestId,
      data: productCategory
    });
  } catch (error) {
    return next(error);
  }
};

const updateProductCategory = async (req, res, next) => {
  try {
    const productCategory = await productCategoryService.updateProductCategory(req.params.id, req.body);

    return successResponse({
      res,
      message: 'Product category updated successfully.',
      requestId: req.requestId,
      data: productCategory
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProductCategory = async (req, res, next) => {
  try {
    const productCategory = await productCategoryService.deleteProductCategory(req.params.id);

    return successResponse({
      res,
      message: 'Product category deleted successfully.',
      requestId: req.requestId,
      data: productCategory
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listProductCategories,
  getProductCategory,
  getProductCategoryOptions,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
};
