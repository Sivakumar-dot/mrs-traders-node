const mongoose = require('mongoose');

const { Schema } = mongoose;

const productCategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productCategorySchema.index(
  { categoryName: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
    collation: { locale: 'en', strength: 2 }
  }
);

productCategorySchema.index({ isDeleted: 1, createdAt: -1 });
productCategorySchema.index({ isDeleted: 1, categoryName: 1 });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
