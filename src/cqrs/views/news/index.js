const logger = require("../../../logger");
const { eventTypes: eventNews } = require("../../aggregates/news");

module.exports = {
  name: "news",
  route: "/news",
  projection: service => ({
    [eventNews.CREATED]: event => {
      logger.info("save event NEWS_CREATED", event.type);
      service.create({ ...event.payload, _id: event.aggregateId });
    },
    [eventNews.UPVOTED]: async event => {
      logger.info("save event NEWS_UPVOTED", event.type);
      const view = await service.get(event.aggregateId);

      await service.patch(event.aggregateId, {
        ...view,
        voted: [...view.voted, event.payload.userId]
      });
    },
    [eventNews.COMMENT_CREATED]: async event => {
      logger.info("save event COMMENT_CREATE", event.type);
      const view = await service.get(event.aggregateId);

      await service.patch(event.aggregateId, {
        ...view,
        comments: { ...view.comments, [event.payload.commentId]: event.payload }
      });
    }
  })
};
