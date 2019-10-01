/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const commandHandler = require("resolve-command").default;
const createEsStorage = require("resolve-storage-lite").default;
// const createSnapshotAdapter = require("resolve-snapshot-lite").default;
const createEventStore = require("resolve-es").default;

const logger = require("../logger");

// the news-aggregate.js file is placed below
const viewsService = require("./viewModels/views.service");
const commandHandlerService = require("./command-handler/command-handler.service");
const internalServices = require("./internals/internals.service");

module.exports = function(app) {
  const aggregates = ["news", "user"].map(file => {
    return require(`./aggregates/${file}`);
  });

  app.set("cqrs:internals:aggregates", aggregates);

  const publishEvent = context => async event => {
    logger.info("Send event type", event.type);
    await context.emit(event.type, event);
  };

  const eventStore = createEventStore({
    storage: createEsStorage({ databaseFile: "./data/event-store.sqlite" }),
    publishEvent: publishEvent(app)
  });

  // const snapshotAdapter = createSnapshotAdapter({
  //   databaseFile: "./data/aggregates-snapshot.sqlite",
  //   bucketSize: 100
  // });

  const execute = commandHandler({
    eventStore,
    aggregates
    // snapshotAdapter
  });

  app.set("eventStore", eventStore);
  app.set("executeCommand", execute);

  app.configure(commandHandlerService);
  app.configure(viewsService);
  app.configure(internalServices);
};
