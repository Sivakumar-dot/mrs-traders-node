const Enquiry = require('../models/enquiry.model');

const createEnquiry = async (payload) => Enquiry.create(payload);

const updateWhatsAppStatus = async (enquiryId, whatsappStatus) =>
  Enquiry.findOneAndUpdate({ enquiryId }, { whatsappStatus }, { new: true });

const findByEnquiryId = async (enquiryId) => Enquiry.findOne({ enquiryId });

module.exports = {
  createEnquiry,
  updateWhatsAppStatus,
  findByEnquiryId
};
