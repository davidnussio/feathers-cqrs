/* eslint-disable no-unused-vars */
const { Conflict } = require("@feathersjs/errors");

const logger = require("../../logger");

exports.CommandHandler = class CommandHandler {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
    this.executeCommand = options.executeCommand;
  }

  async create(command) {
    try {
      return await this.executeCommand(command);
    } catch (err) {
      logger.debug(err.message);
      throw new Conflict(err.message);
    }
  }
};
