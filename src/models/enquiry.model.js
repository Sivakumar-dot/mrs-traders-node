const mongoose = require('mongoose');
const { APP_CONSTANTS } = require('../utils/constants');

const enquirySchema = new mongoose.Schema(
  {
    enquiryId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    customerMobile: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{10,15}$/
    },
    customerMessage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    ipAddress: {
      type: String,
      default: null
    },
    whatsappStatus: {
      type: String,
      enum: Object.values(APP_CONSTANTS.WHATSAPP_STATUS),
      default: APP_CONSTANTS.WHATSAPP_STATUS.PENDING
    },
    requestId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
