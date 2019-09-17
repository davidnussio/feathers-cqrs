const { CREATED, UPVOTED, COMMENT_CREATED } = require("./event_types");

module.exports = {
  Init: () => ({}),
  [CREATED]: (state, { payload: { userId } }) => ({
    ...state,
    createdAt: Date.now(),
    createdBy: userId,
    voted: [],
    comments: {}
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
  })

  // COMMENT_REMOVED: (state, { payload: { commentId } }) =>
  //   state.setIn(["comments", commentId, "removedAt"], Date.now())
};
