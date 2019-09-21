// Initializes the `news` service on path `/news`
const { Internals } = require("./internals.class");
const hooks = require("./internals.hooks");

module.exports = function(app) {
  const options = {};

  // Initialize our service with any options it requires
  app.use("/internals", new Internals(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("internals");

  service.hooks(hooks);
};
