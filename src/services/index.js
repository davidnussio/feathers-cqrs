const commandHandler = require("./command-handler/command-handler.service.js");

// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(commandHandler);
};
