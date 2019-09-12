/* eslint-disable no-unused-vars */
const { Conflict } = require('@feathersjs/errors');

exports.CommandHandler = class CommandHandler {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const command = {
      aggregateId: data.id,
      aggregateName: 'news',
      type: 'createNews',
      payload: {
        title: data.title,
        userId: 'user-id',
        text: 'News content'
      }
    };

    try {
      const event = await this.options.execute(command);
      console.log('saved event', event);
      this.app.emit(event.type, event);
    } catch (err) {
      console.log(err.message);
      throw new Conflict(err.message);
    }
    return data;
  }
};
