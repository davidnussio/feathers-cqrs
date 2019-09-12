// Initializes the `news` service on path `/news`
const { News } = require("./news.class");
const createModel = require("../../models/news.model");
const hooks = require("./news.hooks");
const logger = require("../../logger");

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get("paginate");

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use("/news", new News(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("news");

  service.hooks(hooks);

  app.on("NEWS_CREATED", event => {
    logger.debug("read model news", event);

    ({
      NEWS_CREATED: () => {
        logger.debug("save event");
        service.create({ ...event.payload, _id: event.aggregateId });
      },
      UPVOTE: () => {
        logger.debug("save event");
        service.create({ ...event.payload, _id: event.aggregateId });
      }
    }[event.type]());
  });
};
