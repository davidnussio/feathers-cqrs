const { eventTypes: eventNews } = require("../../aggregates/news");

module.exports = {
  name: "news-stats",
  route: "/news-stats",
  projection: service => ({
    [eventNews.CREATED]: event => {
      service.create({
        _id: event.aggregateId,
        title: event.payload.title,
        voted: 0,
        comments: 0
      });
    },
    [eventNews.UPVOTED]: async event => {
      const view = await service.get(event.aggregateId);

      await service.patch(event.aggregateId, {
        ...view,
        voted: view.voted + 1
      });
    },
    [eventNews.COMMENT_CREATED]: async event => {
      const view = await service.get(event.aggregateId);

      await service.patch(event.aggregateId, {
        ...view,
        comments: view.comments + 1
      });
    }
  })
};
