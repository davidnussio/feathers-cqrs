const commandHandler = require("./command-handler/command-handler.service.js");
const news = require("./news/news.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(commandHandler);
  app.configure(news);
};
