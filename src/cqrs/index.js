const commandHandler = require("resolve-command").default;
const createEsStorage = require("resolve-storage-lite").default;
const createEventStore = require("resolve-es").default;

// the news-aggregate.js file is placed below
const newsAggregate = require("./aggregates/news");
const viewsService = require("./views/views.service");

module.exports = function(app) {
  const aggregates = [newsAggregate];

  const eventStore = createEventStore({ storage: createEsStorage() });
  const execute = commandHandler({
    eventStore,
    aggregates
  });

  app.set("executeCommand", execute);
  app.configure(viewsService);
};
