const generateQR = (tableId) => {
  return `http://localhost:8000/table/${tableId}`;
};

module.exports = { generateQR };
