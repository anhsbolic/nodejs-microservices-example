const generateBillingNumber = () => {
  let nowTime = new Date().getTime();
  return `billing-${nowTime}`;
};

module.exports = { generateBillingNumber };
