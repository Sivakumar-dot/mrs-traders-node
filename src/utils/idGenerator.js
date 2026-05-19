const { v4: uuidv4 } = require('uuid');

const generateUuid = () => uuidv4();

const generateReadableId = (prefix) => {
  const compact = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `${prefix}-${compact}`;
};

module.exports = { generateUuid, generateReadableId };
