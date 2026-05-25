const mongoose = require('mongoose');
const Product = require('./product.model');
const ProductCategory = require('../product-category/product-category.model');
const { createHttpError } = require('../../utils/httpError');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInteger = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return Math.min(parsedValue, max);
};

const normalizeString = (value, fallback = '') => (typeof value === 'string' ? value.trim() : fallback);

const normalizeNonNegativeNumber = (value, fallback = 0) => {
  const parsedValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return fallback;
  }

  return parsedValue;
};

const productCategoryPopulate = {
  path: 'categoryId',
  select: 'categoryName',
  match: { isDeleted: false },
  options: { lean: true },
  transform: (doc, id) => ({
    _id: doc?._id || id,
    categoryName: doc?.categoryName || ''
  })
};

const mapProductWithCategoryName = (product) => {
  if (!product) {
    return product;
  }

  const populatedCategory = product.categoryId;
  const categoryId = populatedCategory && populatedCategory._id ? populatedCategory._id : product.categoryId;

  return {
    ...product,
    categoryId,
    categoryName: populatedCategory && populatedCategory.categoryName ? populatedCategory.categoryName : ''
  };
};

const sanitizeProductPayload = (payload) => ({
  productCode: normalizeString(payload.productCode),
  categoryId: new mongoose.Types.ObjectId(String(payload.categoryId).trim()),
  productName: normalizeString(payload.productName),
  brand: normalizeString(payload.brand),
  description: normalizeString(payload.description),
  price: normalizeNonNegativeNumber(payload.price, 0),
  quantity: normalizeNonNegativeNumber(payload.quantity, 0),
  uom: normalizeString(payload.uom),
  imageUrl: normalizeString(payload.imageUrl),
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

const ensureCategoryExists = async (categoryId) => {
  const category = await ProductCategory.findOne({
    _id: categoryId,
    isDeleted: false
  })
    .select('_id')
    .lean();

  if (!category) {
    throw createHttpError(400, 'Selected category does not exist.');
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
      .populate(productCategoryPopulate)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  return {
    data: products.map(mapProductWithCategoryName),
    totalRecords,
    currentPage: page,
    pageSize: limit
  };
};

const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate(productCategoryPopulate)
    .lean();

  if (!product) {
    throw createHttpError(404, 'Product not found.');
  }

  return mapProductWithCategoryName(product);
};

const createProduct = async (payload) => {
  const sanitizedPayload = sanitizeProductPayload(payload);

  await ensureCategoryExists(sanitizedPayload.categoryId);

  await ensureProductNameIsUnique({
    categoryId: sanitizedPayload.categoryId,
    productName: sanitizedPayload.productName
  });

  try {
    const product = await Product.create({
      ...sanitizedPayload,
      isDeleted: false
    });

    return getProductById(product._id);
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

  await ensureCategoryExists(sanitizedPayload.categoryId);

  await ensureProductNameIsUnique({
    categoryId: sanitizedPayload.categoryId,
    productName: sanitizedPayload.productName,
    excludeId: existingProduct._id
  });

  existingProduct.productCode = sanitizedPayload.productCode;
  existingProduct.categoryId = sanitizedPayload.categoryId;
  existingProduct.productName = sanitizedPayload.productName;
  existingProduct.brand = sanitizedPayload.brand;
  existingProduct.description = sanitizedPayload.description;
  existingProduct.price = sanitizedPayload.price;
  existingProduct.quantity = sanitizedPayload.quantity;
  existingProduct.uom = sanitizedPayload.uom;
  existingProduct.imageUrl = sanitizedPayload.imageUrl;
  existingProduct.isActive = sanitizedPayload.isActive;

  try {
    await existingProduct.save();
    return getProductById(existingProduct._id);
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Product name already exists in this category.');
    }

    throw error;
  }
};

const deleteProduct = async (id) => {
  const deletedProduct = await Product.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, {
    new: true
  })
    .populate(productCategoryPopulate)
    .lean();

  if (!deletedProduct) {
    throw createHttpError(404, 'Product not found.');
  }

  return mapProductWithCategoryName(deletedProduct);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
