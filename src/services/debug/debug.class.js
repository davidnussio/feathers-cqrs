const logger = require("../../logger");

async function run(eventStore, eventFilter) {
  // eslint-disable-next-line global-require
  const { projection } = require("../../cqrs/aggregates/news");
  let state = projection.Init();

  const eventHandler = async event => {
    logger.info("Event from eventstore...", event.type);
    state = await projection[event.type](state, event);
  };

  await eventStore.loadEvents(eventFilter, eventHandler);

  logger.info("state", state);

  return state;
}

exports.Debug = class Debug {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
    this.eventStore = options.eventStore;
  }

  async find(params) {
    logger.info("Find data...", params);
    // Load events

    const eventFilter = {
      // eventTypes: ["news/created"] // Or null to load ALL event types
      aggregateIds: ["0debee1f-9cf9-42fa-b9a4-77835fd07264"] // Or null to load ALL aggregate ids
      // startTime: Date.now() - 10000, // Or null to load events from beginning of time
      // finishTime: Date.now() + 10000 // Or null to load events to current time
    };

    const result = await run(this.eventStore, eventFilter);
    logger.info("result", result);
    return result;
  }

  async get(id, params) {
    logger.info("Find data...", params);
    // Load events

    const eventFilter = {
      // eventTypes: ["news/created"] // Or null to load ALL event types
      aggregateIds: [id] // Or null to load ALL aggregate ids
      // startTime: Date.now() - 10000, // Or null to load events from beginning of time
      // finishTime: Date.now() + 10000 // Or null to load events to current time
    };

    const result = await run(this.eventStore, eventFilter);
    logger.info("result", result);
    return result;
  }
};
