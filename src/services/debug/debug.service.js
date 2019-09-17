// Initializes the `debug` service on path `/debug`
const { Debug } = require("./debug.class");
const hooks = require("./debug.hooks");

module.exports = function(app) {
  const eventStore = app.get("eventStore");

  const options = {
    eventStore
    // execute
    // eventStore
  };

  // Initialize our service with any options it requires
  app.use("/debug", new Debug(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("debug");

  service.hooks(hooks);
};
