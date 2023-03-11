const generateInvoiceNumber = () => {
  let nowTime = new Date().getTime();
  return `invoice-${nowTime}`;
};

module.exports = { generateInvoiceNumber };
