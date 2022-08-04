exports.responseSuccess = (msg, data, code) => {
  let result = {};

  result.message = msg;
  result.data = data || null;
  result.code = code;
  result.success = true;

  return result;
};

exports.responseError = (msg, code) => {
  let result = {};

  result.message = msg;
  result.code = code;
  result.success = false;

  return result;
};