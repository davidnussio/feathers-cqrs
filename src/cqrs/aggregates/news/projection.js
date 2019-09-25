const { CREATED, DELETED, UPVOTED, COMMENT_CREATED } = require("./event_types");

module.exports = {
  Init: () => ({}),
  [CREATED]: (state, { payload }) => ({
    ...state,
    ...payload
  }),

  [UPVOTED]: (state, { payload: { userId } }) => ({
    ...state,
    voted: [...state.voted, userId]
  }),

  [COMMENT_CREATED]: (
    state,
    { payload: { commentId, createdBy, createdAt, comment } }
  ) => ({
    ...state,
    comments: {
      ...state.comments,
      [commentId]: {
        createdAt,
        createdBy,
        comment
      }
    }
  }),

  [DELETED]: (state, { payload }) => ({
    ...state,
    removedAt: payload.removedAt
  })
};
