const generatePoNumber = () => {
  let nowTime = new Date().getTime();
  return `po-${nowTime}`;
};

module.exports = { generatePoNumber };
