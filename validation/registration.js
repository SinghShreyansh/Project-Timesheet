const Validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateRegister(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';

  if (Validator.isEmpty(data.name)) {
    errors.message = "Name field is required!";
    errors.code = 400;
    errors.success = false;
  }

  if (Validator.isEmpty(data.email)) {
    errors.message = "Email field is required!";
    errors.code = 400;
    errors.success = false;
  }

  if (!Validator.isEmail(data.email)) {
    errors.message = "Email is Invalid!";
    errors.code = 400;
    errors.success = false;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}