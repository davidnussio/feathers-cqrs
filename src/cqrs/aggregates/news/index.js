const projection = require("./projection");
const commands = require("./commands");
const eventTypes = require("./event_types");

module.exports = {
  name: "news",
  projection,
  commands,
  eventTypes
};
