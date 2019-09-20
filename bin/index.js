#!/usr/bin/env node

const commander = require("commander");
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

function generateNews(env) {
  const { parent } = env;
  const url = `${parent.url}/command-handler`;
  console.log("Create news...", url);
  inquirer
    .prompt([
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
      const { votedUp, comments } = answers;
      const aggregateId = uuid().toString();
      const aggregateName = "news";
      console.log("Aggregate id %s", aggregateId);
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
}

function findReadModel(env) {
  const { parent } = env;
  const url = `${parent.url}/read-model`;

  inquirer
    .prompt([
      {
        type: "string",
        name: "readModel",
        message: "What is the name of your readModel?",
        default: "news"
      },
      {
        type: "string",
        name: "aggregateId",
        message: "What is your aggregate id?",
        default: "74f893cc-932a-4fda-92c9-6c32575152dd"
      }
    ])
    .then(async answers => {
      const { readModel } = answers;
      console.log("readModel", readModel);
      const response = await axios.get(
        `${url}/${readModel}/2e4ffa8c-9178-4385-9035-e7ac64abdeda`
      );
      console.log(response.data);
    });
}

commander
  .version("0.0.1")
  .option("-u, --url <url>", "command handler url", "http://localhost:3030");

commander.command("generate").action(generateNews);
commander.command("readModel").action(findReadModel);

commander.parse(process.argv);
