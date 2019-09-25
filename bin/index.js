#!/usr/bin/env node

/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

const commander = require("commander");
const inquirer = require("inquirer");
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require("axios");
const uuid = require("uuid/v4");
const faker = require("faker");

async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

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
        name: "nEvents",
        message: "How many events?",
        default: 10
      }
    ])
    .then(async answers => {
      const { nEvents } = answers;
      const aggregateId = uuid().toString();
      const aggregateName = "news";
      console.log("Aggregate id %s", aggregateId);
      await axios
        .post(url, {
          aggregateId,
          aggregateName,
          type: "createNews",
          payload: {
            title: faker.lorem.sentence(),
            userId: uuid().toString(),
            text: faker.lorem.paragraph()
          }
        })
        .catch(console.error);

      for (let e = 0; e < nEvents; e++) {
        for (let i = 0; i < Math.random() * 20; i++) {
          const userId = uuid().toString();
          await executeVotedUp(url, aggregateId, aggregateName, userId).catch(
            console.error
          );
          await delay(1000);
        }
        for (let i = 0; i < Math.random() * 20; i++) {
          const userId = uuid().toString();
          await executeComment(url, aggregateId, aggregateName, userId).catch(
            console.error
          );
          await delay(1000);
        }
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
  .option(
    "-u, --url <url>",
    "command handler url",
    "http://localhost:3030/api"
  );

commander.command("generate").action(generateNews);
commander.command("readModel").action(findReadModel);

commander.parse(process.argv);
