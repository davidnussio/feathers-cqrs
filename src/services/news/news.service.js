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

  const projection = {
    NEWS_CREATED: event => {
      logger.info("save event NEWS_CREATED", event);
      service.create({ ...event.payload, _id: event.aggregateId });
    },
    NEWS_UPVOTED: async event => {
      logger.info("save event NEWS_UPVOTED", event);
      const view = await service.get(event.aggregateId);
      logger.info("view", view);

      await service.patch(event.aggregateId, {
        ...view,
        voted: [...view.voted, event.payload.userId]
      });
    }
  };

  Object.keys(projection).forEach(eventName => {
    app.on(eventName, projection[eventName]);
  });
  // app.on("NEWS_UPVOTED", event => {
  //   console.log("NEWS_UPVOTED", event, "saved");
  // });
};
