const validate = require("../validation");
const { CREATED, DELETED, UPVOTED, COMMENT_CREATED } = require("./event_types");

module.exports = {
  createNews: (state, command) => {
    validate(state, { createdAt: { type: "forbidden" } });
    validate(command, {
      payload: {
        type: "object",
        props: {
          title: { type: "string" },
          userId: { type: "string" }
        }
      }
    });

    const { title, userId, text, link = "", voted = [] } = command.payload;

    return {
      type: CREATED,
      payload: {
        __metadata: { version: "1.4.2-mafia" }, // TODO metadata idea
        title,
        text,
        link,
        userId,
        voted
      }
    };
  },

  deleteNews: state => {
    validate(state, {
      createdAt: {
        type: "any",
        messages: { required: "Aggregate is not exist" }
      }
    });
    validate(state, {
      removedAt: {
        type: "forbidden",
        messages: { forbidden: "Aggregate is already deleted" }
      }
    });

    return {
      type: DELETED,
      payload: {
        removedAt: Date.now()
      }
    };
  },

  upvoteNews: (state, command) => {
    validate(state, {
      createdAt: {
        type: "any",
        messages: { required: "Aggregate is not exist" }
      }
    });
    validate(state, {
      removedAt: {
        type: "forbidden",
        messages: { forbidden: "Aggregate is already deleted" }
      }
    });
    validate(command, {
      payload: {
        type: "object",
        props: {
          userId: { type: "any" }
        }
      }
    });

    const { userId } = command.payload;

    return {
      type: UPVOTED,
      payload: {
        userId
      }
    };
  },

  unvoteNews: () => {
    throw new Error("Not implemented");
  },

  createComment: (state, command) => {
    validate(state, {
      createdAt: {
        type: "any",
        messages: { required: "Aggregate is not exist" }
      }
    });
    validate(state, {
      removedAt: {
        type: "forbidden",
        messages: { forbidden: "Aggregate is already deleted" }
      }
    });
    validate(command, {
      payload: {
        type: "object",
        props: {
          userId: { type: "any" }
        }
      }
    });

    const { comment, userId, commentId } = command.payload;

    return {
      type: COMMENT_CREATED,
      payload: {
        commentId,
        comment,
        createdAt: Date.now(),
        createdBy: userId
      }
    };
  },

  updateComment: () => {
    throw new Error("Not implemented");
  },

  removeComment: () => {
    throw new Error("Not implemented");
  }
};
