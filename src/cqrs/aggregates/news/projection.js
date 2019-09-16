module.exports = {
  Init: () => ({}),
  NEWS_CREATED: (state, { payload: { userId } }) => ({
    ...state,
    createdAt: Date.now(),
    createdBy: userId,
    voted: [],
    comments: {}
  }),

  NEWS_UPVOTED: (state, { payload: { userId } }) => ({
    ...state,
    voted: [...state.voted, userId]
  }),

  // NEWS_UNVOTED: (state, { payload: { userId } }) =>
  //   state.update("voted", voted =>
  //     voted.filter(curUserId => curUserId !== userId)
  //   ),

  COMMENT_CREATED: (state, { payload: { commentId, userId, comment } }) => ({
    ...state,
    comments: {
      commentId,
      createdAt: Date.now(),
      createdBy: userId,
      comment
    }
  })

  // COMMENT_REMOVED: (state, { payload: { commentId } }) =>
  //   state.setIn(["comments", commentId, "removedAt"], Date.now())
};
