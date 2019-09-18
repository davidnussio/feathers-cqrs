const commandHandler = require("resolve-command").default;
const createEsStorage = require("resolve-storage-lite").default;
const createEventStore = require("resolve-es").default;

const logger = require("../logger");

// the news-aggregate.js file is placed below
const newsAggregate = require("./aggregates/news");
const readModelService = require("./readModel/readModel.service");
const viewsService = require("./views/views.service");

module.exports = function(app) {
  const aggregates = [newsAggregate];

  const publishEvent = context => async event => {
    logger.info("Send event type", event.type);
    context.emit(event.type, event);
  };

  const eventStore = createEventStore({
    storage: createEsStorage("./data/event-store.sqlite"),
    publishEvent: publishEvent(app)
  });
  const execute = commandHandler({
    eventStore,
    aggregates
  });

  app.set("eventStore", eventStore);
  app.set("executeCommand", execute);

  app.configure(viewsService);
  app.configure(readModelService);
};
