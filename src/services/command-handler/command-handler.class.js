/* eslint-disable no-unused-vars */
const { Conflict } = require("@feathersjs/errors");

const logger = require("../../logger");

exports.CommandHandler = class CommandHandler {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
    this.executeCommand = options.executeCommand;
  }

  async create(command, params) {
    logger.info("Create command");
    try {
      const event = await this.executeCommand(command);
      this.app.emit(event.type, event);
      return event;
    } catch (err) {
      logger.debug(err.message);
      throw new Conflict(err.message);
    }
  }
};
