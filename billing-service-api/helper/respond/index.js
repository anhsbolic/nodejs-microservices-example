const config = require('../../config');

/**
 * Code : 200
 * Response : Success
 * @param {Object} res express response object
 * @param {String} msg message
 * @param {Any} data any type of data
 * @param {Object} meta additional data object
 */
const responseSuccess = (res, msg = 'Success', data, meta) => {
  res.status(200).send({
    success: true,
    message: msg,
    data: data,
    meta: meta,
  });
};

/**
 * Code : 200
 * Response : Fail
 * @param {Object} res express response object
 * @param {String} msg message
 * @param {Any} data any type of data
 * @param {Object} meta additional data object
 */
const responseFail = (res, msg = 'Fail', data, meta) => {
  res.status(200).send({
    success: false,
    message: msg,
    data: data,
    meta: meta,
  });
};

/**
 * Code : 201
 * Response : Data Created
 * @param {Object} res express response object
 * @param {String} msg message
 * @param {Any} data any type of data
 * @param {Object} meta additional data object
 */
const responseCreated = (res, msg = 'Data Created', data, meta) => {
  res.status(201).send({
    success: true,
    message: msg,
    data: data,
    meta: meta,
  });
};

/**
 * Response Error
 * @param {Object} res express response object
 * @param {Number} statusCode http status code
 * @param {String} msg message
 */
const responseError = (
  res,
  statusCode = 500,
  msg = 'Internal Server Error'
) => {
  if (config.nodeEnv === 'production') {
    msg = 'Internal Server Error';
  }

  res.status(statusCode).send({
    success: false,
    message: msg,
  });
};

module.exports = {
  responseSuccess,
  responseFail,
  responseCreated,
  responseError,
};
