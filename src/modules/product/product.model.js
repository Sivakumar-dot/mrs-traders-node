const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productCode: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ''
    },
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
    brand: {
      type: String,
      trim: true,
      maxlength: 150,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    price: {
      type: Number,
      min: 0,
      default: 0
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0
    },
    uom: {
      type: String,
      trim: true,
      maxlength: 50,
      default: ''
    },
    imageUrl: {
      type: String,
      trim: true,
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
productSchema.index({ isDeleted: 1, productCode: 1 });

module.exports = mongoose.model('Product', productSchema);
