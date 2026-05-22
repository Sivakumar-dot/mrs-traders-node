const ProductCategory = require('./product-category.model');
const { createHttpError } = require('../../utils/httpError');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInteger = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return Math.min(parsedValue, max);
};

const sanitizeProductCategoryPayload = (payload) => ({
  categoryName: String(payload.categoryName).trim(),
  description: typeof payload.description === 'string' ? payload.description.trim() : '',
  isActive: typeof payload.isActive === 'boolean' ? payload.isActive : true
});

const buildDuplicateQuery = ({ categoryName, excludeId }) => {
  const query = {
    isDeleted: false,
    categoryName
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return query;
};

const ensureCategoryNameIsUnique = async ({ categoryName, excludeId = null }) => {
  const duplicate = await ProductCategory.findOne(buildDuplicateQuery({ categoryName, excludeId }))
    .collation({ locale: 'en', strength: 2 })
    .select('_id')
    .lean();

  if (duplicate) {
    throw createHttpError(409, 'Category name already exists.');
  }
};

const getProductCategories = async (query) => {
  const page = Number.isInteger(query.page) ? query.page : parsePositiveInteger(query.page, 1);
  const limit = Number.isInteger(query.limit) ? query.limit : parsePositiveInteger(query.limit, 10, 100);
  const skip = (page - 1) * limit;
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const sortBy = query.sortBy || 'updatedAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const filter = { isDeleted: false };

  if (search) {
    filter.categoryName = { $regex: escapeRegExp(search), $options: 'i' };
  }

  const [productCategories, totalRecords] = await Promise.all([
    ProductCategory.find(filter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductCategory.countDocuments(filter)
  ]);

  return {
    data: productCategories,
    totalRecords,
    currentPage: page,
    pageSize: limit
  };
};

const getProductCategoryById = async (id) => {
  const productCategory = await ProductCategory.findOne({ _id: id, isDeleted: false }).lean();

  if (!productCategory) {
    throw createHttpError(404, 'Product category not found.');
  }

  return productCategory;
};

const getProductCategoryOptions = async () => {
  return ProductCategory.find({
    isDeleted: false,
    isActive: true
  })
    .select('_id categoryName')
    .sort({ categoryName: 1, _id: 1 })
    .collation({ locale: 'en', strength: 2 })
    .lean();
};

const createProductCategory = async (payload) => {
  const sanitizedPayload = sanitizeProductCategoryPayload(payload);

  await ensureCategoryNameIsUnique({
    categoryName: sanitizedPayload.categoryName
  });

  try {
    return await ProductCategory.create({
      ...sanitizedPayload,
      isDeleted: false
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Category name already exists.');
    }

    throw error;
  }
};

const updateProductCategory = async (id, payload) => {
  const existingProductCategory = await ProductCategory.findOne({ _id: id, isDeleted: false });

  if (!existingProductCategory) {
    throw createHttpError(404, 'Product category not found.');
  }

  const sanitizedPayload = sanitizeProductCategoryPayload(payload);

  await ensureCategoryNameIsUnique({
    categoryName: sanitizedPayload.categoryName,
    excludeId: existingProductCategory._id
  });

  existingProductCategory.categoryName = sanitizedPayload.categoryName;
  existingProductCategory.description = sanitizedPayload.description;
  existingProductCategory.isActive = sanitizedPayload.isActive;

  try {
    await existingProductCategory.save();
    return existingProductCategory;
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Category name already exists.');
    }

    throw error;
  }
};

const deleteProductCategory = async (id) => {
  const deletedProductCategory = await ProductCategory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  ).lean();

  if (!deletedProductCategory) {
    throw createHttpError(404, 'Product category not found.');
  }

  return deletedProductCategory;
};

module.exports = {
  getProductCategories,
  getProductCategoryById,
  getProductCategoryOptions,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
};
