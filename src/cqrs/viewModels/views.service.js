/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// Initializes the `news` service on path `/news`
// const fs = require("fs");
const { Views } = require("./views.class");
const createModel = require("../../models/news.model");
const hooks = require("./views.hooks");
const logger = require("../../logger");

// const newsViewModel = require("./news");
// const newsUpperCaseViewModel = require("./newsStats");

module.exports = function(app) {
  // TODO: This job will be done by a fs scanning (autodiscovery)
  const viewModels = ["news", "newsStats", "newsList"].map(file => {
    return require(`./${file}`);
  });

  app.set("cqrs:internals:viewModels", viewModels);

  viewModels.forEach(({ name, route, projection: createProjection }) => {
    logger.info(`Configure view model: ${name}`);
    const Model = createModel(app, name);
    const paginate = app.get("paginate");

    const options = {
      Model,
      paginate
    };
    app.use(route, new Views(options, app));
    const service = app.service(name);

    service.hooks(hooks);

    const projection = createProjection(service);

    Object.keys(projection).forEach(eventName => {
      app.on(eventName, projection[eventName]);
    });
  });
};
