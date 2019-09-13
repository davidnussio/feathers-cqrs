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
      logger.info("save event NEWS_CREATED");
      service.create({ ...event.payload, _id: event.aggregateId });
    },
    NEWS_UPVOTED: event => {
      logger.info("save event NEWS_UPVOTED");
      service.patch(event.aggregateId, { ...event.payload });
    }
  };

  Object.keys(projection).forEach(eventName => {
    app.on(eventName, projection[eventName]);
  });
  // app.on("NEWS_UPVOTED", event => {
  //   console.log("NEWS_UPVOTED", event, "saved");
  // });
};
