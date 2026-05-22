const mongoose = require('mongoose');
const Product = require('./product.model');
const { createHttpError } = require('../../utils/httpError');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInteger = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return Math.min(parsedValue, max);
};

const sanitizeProductPayload = (payload) => ({
  categoryId: new mongoose.Types.ObjectId(String(payload.categoryId).trim()),
  productName: String(payload.productName).trim(),
  description: typeof payload.description === 'string' ? payload.description.trim() : '',
  isActive: typeof payload.isActive === 'boolean' ? payload.isActive : true
});

const buildDuplicateQuery = ({ categoryId, productName, excludeId }) => {
  const query = {
    categoryId,
    isDeleted: false,
    productName
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return query;
};

const ensureProductNameIsUnique = async ({ categoryId, productName, excludeId = null }) => {
  const duplicate = await Product.findOne(buildDuplicateQuery({ categoryId, productName, excludeId }))
    .collation({ locale: 'en', strength: 2 })
    .select('_id')
    .lean();

  if (duplicate) {
    throw createHttpError(409, 'Product name already exists in this category.');
  }
};

const getProducts = async (query) => {
  const page = Number.isInteger(query.page) ? query.page : parsePositiveInteger(query.page, 1);
  const limit = Number.isInteger(query.limit) ? query.limit : parsePositiveInteger(query.limit, 10, 100);
  const skip = (page - 1) * limit;
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const sortBy = query.sortBy || 'updatedAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const filter = { isDeleted: false };

  if (search) {
    filter.productName = { $regex: escapeRegExp(search), $options: 'i' };
  }

  const [products, totalRecords] = await Promise.all([
    Product.find(filter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  return {
    data: products,
    totalRecords,
    currentPage: page,
    pageSize: limit
  };
};

const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false }).lean();

  if (!product) {
    throw createHttpError(404, 'Product not found.');
  }

  return product;
};

const createProduct = async (payload) => {
  const sanitizedPayload = sanitizeProductPayload(payload);

  await ensureProductNameIsUnique({
    categoryId: sanitizedPayload.categoryId,
    productName: sanitizedPayload.productName
  });

  try {
    return await Product.create({
      ...sanitizedPayload,
      isDeleted: false
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Product name already exists in this category.');
    }

    throw error;
  }
};

const updateProduct = async (id, payload) => {
  const existingProduct = await Product.findOne({ _id: id, isDeleted: false });

  if (!existingProduct) {
    throw createHttpError(404, 'Product not found.');
  }

  const sanitizedPayload = sanitizeProductPayload(payload);

  await ensureProductNameIsUnique({
    categoryId: sanitizedPayload.categoryId,
    productName: sanitizedPayload.productName,
    excludeId: existingProduct._id
  });

  existingProduct.categoryId = sanitizedPayload.categoryId;
  existingProduct.productName = sanitizedPayload.productName;
  existingProduct.description = sanitizedPayload.description;
  existingProduct.isActive = sanitizedPayload.isActive;

  try {
    await existingProduct.save();
    return existingProduct;
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Product name already exists in this category.');
    }

    throw error;
  }
};

const deleteProduct = async (id) => {
  const deletedProduct = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  ).lean();

  if (!deletedProduct) {
    throw createHttpError(404, 'Product not found.');
  }

  return deletedProduct;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
