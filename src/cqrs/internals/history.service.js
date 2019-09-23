// Initializes the `news` service on path `/news`
const { History } = require("./history.class");
const hooks = require("./internals.hooks");
const logger = require("../../logger");

const newsAggregate = require("../aggregates/news");

module.exports = function(app) {
  const eventStore = app.get("eventStore");

  const aggregates = [newsAggregate];

  app.set("cqrs:internals:aggregates", aggregates);

  aggregates.forEach(({ name, projection }) => {
    logger.info(`Configure readModel: ${name}`);
    app.set(`readModel/${name}`, projection);
  });

  const options = {
    eventStore
  };

  app.use("/history", new History(options, app));

  const service = app.service("history");

  app.use("/history/:readModel/:aggregateId", service);

  app.service("/history/:readModel/:aggregateId").hooks({
    before: {
      get(context) {
        context.params.query.readModel = context.params.route.readModel;
        context.params.query.aggregateId = context.params.route.aggregateId;
      }
    }
  });

  service.hooks(hooks);
};
