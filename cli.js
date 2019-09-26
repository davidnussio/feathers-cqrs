/* eslint-disable no-await-in-loop */
const vorpal = require("vorpal")();

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

async function generateNewsAggregate(url, nEvents, delayMs) {
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
      await delay(delayMs);
    }
    for (let i = 0; i < Math.random() * 20; i++) {
      const userId = uuid().toString();
      await executeComment(url, aggregateId, aggregateName, userId).catch(
        console.error
      );
      await delay(delayMs);
    }
  }
}

vorpal
  .command("generate [aggregateName]")
  .autocomplete(["news"])
  .option("-u, --url <url>", "http server baseUrl", [
    "http://localhost:3030/api"
  ])
  .action(function(args, callback) {
    this.prompt(
      {
        type: "input",
        name: "nEvents",
        message: "How many iteration do you want? "
      },
      async result => {
        const url = `${args.options.url}/command-handler`;
        this.log(`Ok, ${args.aggregateName} with ${result.nEvents} iterations`);
        await generateNewsAggregate(url, result.nEvents, 5);
        callback();
      }
    );
  });

vorpal.show().parse(process.argv);
