const { eventTypes: news } = require("../../aggregates/news");

module.exports = {
  name: "news-list",
  route: "/news-list",
  projection: service => ({
    [news.CREATED]: event => {
      service.create({ title: event.payload.title, _id: event.aggregateId });
    }
  })
};
