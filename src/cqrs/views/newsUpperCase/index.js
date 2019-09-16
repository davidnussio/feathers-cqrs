const logger = require("../../../logger");
const { eventTypes: eventNews } = require("../../aggregates/news");

module.exports = {
  name: "news-upper-case",
  route: "/news-upper-case",
  projection: service => ({
    [eventNews.CREATED]: event => {
      logger.info("save event NEWS_CREATED", event);
      service.create({
        _id: event.aggregateId,
        title: event.payload.title.toUpperCase(),
        voted: 0,
        comments: 0
      });
    },
    [eventNews.UPVOTED]: async event => {
      logger.info("save event NEWS_UPVOTED", event);
      const view = await service.get(event.aggregateId);
      logger.info("view", view);

      await service.patch(event.aggregateId, {
        ...view,
        voted: view.voted + 1
      });
    },
    [eventNews.COMMENT_CREATED]: async event => {
      logger.info("save event COMMENT_CREATE", event);
      const view = await service.get(event.aggregateId);
      logger.info("view", view);

      await service.patch(event.aggregateId, {
        ...view,
        comments: view.comments + 1
      });
    }
  })
};
