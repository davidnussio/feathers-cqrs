const commandHandler = require("resolve-command").default;
const createEsStorage = require("resolve-storage-lite").default;
const createEventStore = require("resolve-es").default;

const logger = require("../logger");

// the news-aggregate.js file is placed below
const newsAggregate = require("./aggregates/news");
const viewsService = require("./viewModels/views.service");
const commandHandlerService = require("./command-handler/command-handler.service");
const internalServices = require("./internals/internals.service");

module.exports = function(app) {
  const aggregates = [newsAggregate];

  const publishEvent = context => async event => {
    logger.info("Send event type", event.type);
    await context.emit(event.type, event);
  };

  const eventStore = createEventStore({
    storage: createEsStorage({ databaseFile: "./data/event-store.sqlite" }),
    publishEvent: publishEvent(app)
  });
  const execute = commandHandler({
    eventStore,
    aggregates
  });

  app.set("eventStore", eventStore);
  app.set("executeCommand", execute);

  app.configure(internalServices);
  app.configure(commandHandlerService);
  app.configure(viewsService);
};
