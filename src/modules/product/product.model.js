const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: true,
      index: true
    },
    productName: {
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

productSchema.index(
  { categoryId: 1, productName: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
    collation: { locale: 'en', strength: 2 }
  }
);

productSchema.index({ isDeleted: 1, createdAt: -1 });
productSchema.index({ isDeleted: 1, productName: 1 });

module.exports = mongoose.model('Product', productSchema);
