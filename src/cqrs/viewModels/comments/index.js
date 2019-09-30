const { eventTypes: eventNews } = require("../../aggregates/news");

module.exports = {
  name: "comments",
  route: "/comments",
  projection: app => ({
    [eventNews.COMMENT_CREATED]: async event => {
      const {
        aggregateId,
        payload: {
          commentId,
          comment,
          createdBy: { user }
        }
      } = event;
      const news = await app
        .service("read-model")
        .find({ query: { readModel: "news", aggregateId } });
      return app
        .service("comments")
        .create({ commentId, comment, user, newsTitle: news.title });
    }
  })
};
