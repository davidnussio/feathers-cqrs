module.exports = {
  createNews: (state, { payload: { title, link, userId, text } }) => {
    if (state.createdAt) {
      throw new Error("Aggregate already exists");
    }

    if (!title) {
      throw new Error("Title is required");
    }

    if (!userId) {
      throw new Error("UserId is required");
    }

    return {
      type: "NEWS_CREATED",
      payload: {
        title,
        text,
        link,
        userId
      }
    };
  },

  upvoteNews: (state, { payload: { userId } }) => {
    if (!state.createdAt || state.removedAt) {
      throw new Error("Aggregate is not exist");
    }

    if (state.voted.includes(userId)) {
      throw new Error("User already voted");
    }

    if (!userId) {
      throw new Error("UserId is required");
    }

    return {
      type: "NEWS_UPVOTED",
      payload: {
        userId
      }
    };
  },

  unvoteNews: (state, { payload: { userId } }) => {
    if (!state.createdAt || state.removedAt) {
      throw new Error("Aggregate is not exist");
    }

    if (!state.voted.includes(userId)) {
      throw new Error("User has not voted");
    }

    if (!userId) {
      throw new Error("UserId is required");
    }

    return {
      type: "NEWS_UNVOTED",
      payload: {
        userId
      }
    };
  },

  deleteNews: state => {
    if (!state.createdAt || state.removedAt) {
      throw new Error("Aggregate is not exist");
    }

    return {
      type: "NEWS_DELETED",
      payload: {}
    };
  },

  createComment: (
    state,
    { payload: { text, parentId, userId, commentId } }
  ) => {
    if (!state.createdAt || state.removedAt) {
      throw new Error("Aggregate is not exist");
    }

    if (!text) {
      throw new Error("Text is required");
    }

    if (!parentId) {
      throw new Error("ParentId is required");
    }

    if (!userId) {
      throw new Error("UserId is required");
    }

    return {
      type: "COMMENT_CREATED",
      payload: {
        text,
        parentId,
        userId,
        commentId
      }
    };
  },

  updateComment: (state, { payload: { text, commentId, userId } }) => {
    if (!state.createdAt || state.removedAt) {
      throw new Error("Aggregate is not exist");
    }

    if (state.createdBy !== userId) {
      throw new Error("Permission denied");
    }

    if (!text) {
      throw new Error("Text is required");
    }

    return {
      type: "COMMENT_UPDATED",
      payload: {
        text,
        commentId
      }
    };
  },

  removeComment: (state, { payload: { commentId, userId } }) => {
    if (!state.createdAt || state.removedAt) {
      throw new Error("Aggregate is not exist");
    }

    if (state.createdBy !== userId) {
      throw new Error("Permission denied");
    }

    return { type: "COMMENT_REMOVED", payload: { commentId } };
  }
};
