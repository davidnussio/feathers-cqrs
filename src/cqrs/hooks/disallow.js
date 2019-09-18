const errors = require("@feathersjs/errors");

module.exports = function() {
  return context => {
    throw new errors.MethodNotAllowed(
      `Can not call '${context.method}' method on viewModel. (disallow)`
    );
  };
};
