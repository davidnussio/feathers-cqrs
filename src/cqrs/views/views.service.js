// Initializes the `news` service on path `/news`
const { Views } = require("./views.class");
const createModel = require("../../models/news.model");
const hooks = require("./views.hooks");
const logger = require("../../logger");

const newsViewModel = require("./news");
const newsUpperCaseViewModel = require("./newsUpperCase");

module.exports = function(app) {
  const viewModels = [newsViewModel, newsUpperCaseViewModel];

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
