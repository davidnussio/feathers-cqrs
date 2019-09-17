const commandHandler = require("./command-handler/command-handler.service.js");
const debug = require("./debug/debug.service.js");
// const viewModels = require("../cqrs/views/views.service");
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(commandHandler);
  app.configure(debug);
};
