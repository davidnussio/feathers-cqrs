const inquirer = require("inquirer");
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require("axios");
const uuid = require("uuid/v4");
const faker = require("faker");

function executeVotedUp(url, aggregateId, aggregateName, userId) {
  return axios.post(url, {
    aggregateId,
    aggregateName,
    type: "upvoteNews",
    payload: {
      userId
    }
  });
}

function executeComment(url, aggregateId, aggregateName, userId) {
  return axios.post(url, {
    aggregateId,
    aggregateName,
    type: "createComment",
    payload: {
      commentId: uuid().toString(),
      comment: faker.random.words(25),
      userId
    }
  });
}

console.log("Create news...");

inquirer
  .prompt([
    {
      type: "input",
      name: "url",
      message: "Command handler url:",
      default: "http://localhost:3030/command-handler"
    },
    {
      type: "number",
      name: "votedUp",
      message: "How many voted up?",
      default: 1
    },
    {
      type: "number",
      name: "comments",
      message: "How many comments?",
      default: 1
    }
  ])
  .then(async answers => {
    const { url, votedUp, comments } = answers;
    console.log(url, votedUp, comments);

    const aggregateId = uuid().toString();
    const aggregateName = "news";
    await axios
      .post(url, {
        aggregateId,
        aggregateName,
        type: "createNews",
        payload: {
          title: faker.random.words(2),
          userId: uuid().toString(),
          text: faker.random.words(25)
        }
      })
      .catch(console.error);
    for (let i = 0; i < votedUp; i++) {
      const userId = uuid().toString();
      // eslint-disable-next-line no-await-in-loop
      await executeVotedUp(url, aggregateId, aggregateName, userId).catch(
        console.error
      );
    }
    for (let i = 0; i < comments; i++) {
      const userId = uuid().toString();
      // eslint-disable-next-line no-await-in-loop
      await executeComment(url, aggregateId, aggregateName, userId).catch(
        console.error
      );
    }
  });
