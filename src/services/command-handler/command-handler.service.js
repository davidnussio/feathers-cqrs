const commandHandler = require('resolve-command').default;
const createEsStorage = require('resolve-storage-lite').default;
const createEventStore = require('resolve-es').default;

// the news-aggregate.js file is placed below
const newsAggregate = require('./news-aggregate');
const aggregates = [newsAggregate];

// Initializes the `commandHandler` service on path `/command-handler`
const { CommandHandler } = require('./command-handler.class');
const hooks = require('./command-handler.hooks');

module.exports = function(app) {
  // const paginate = app.get('paginate');

  const eventStore = createEventStore({ storage: createEsStorage() });
  const execute = commandHandler({
    eventStore,
    aggregates
  });

  const options = {
    execute,
    eventStore
  };

  // Initialize our service with any options it requires
  app.use('/command-handler', new CommandHandler(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('command-handler');

  service.hooks(hooks);
};
