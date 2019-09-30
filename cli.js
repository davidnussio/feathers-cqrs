/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
const vorpal = require("vorpal")();

// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require("axios");
const uuid = require("uuid/v4");
const faker = require("faker");

function chooseWeighted(items, chances) {
  const sum = chances.reduce((acc, el) => acc + el, 0);
  let acc = 0;
  chances = chances.map(el => (acc = el + acc));
  const rand = Math.random() * sum;
  return items[chances.filter(el => el <= rand).length];
}

async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function popElement(array) {
  const len = array.length - 1;
  const rand = Math.floor(Math.random() * len);
  return array.splice(rand, 1);
}

function executeUpVoted(url, aggregateId, aggregateName, userId) {
  return axios.post(url, {
    aggregateId,
    aggregateName,
    type: "upvoteNews",
    payload: {
      userId
    }
  });
}

function executeUnVoted(url, aggregateId, aggregateName, userId) {
  return axios.post(url, {
    aggregateId,
    aggregateName,
    type: "unvoteNews",
    payload: {
      userId
    }
  });
}

function executeComment(url, aggregateId, aggregateName, commentId, user) {
  return axios.post(url, {
    aggregateId,
    aggregateName,
    type: "createComment",
    payload: {
      commentId,
      comment: faker.random.words(25),
      user
    }
  });
}

function executeRemoveComment(url, aggregateId, aggregateName, commentId) {
  return axios.post(url, {
    aggregateId,
    aggregateName,
    type: "removeComment",
    payload: {
      commentId
    }
  });
}

async function* generateNewsAggregate(url, nEvents, delayMs) {
  const aggregateId = uuid().toString();
  const aggregateName = "news";
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

  // yield `Aggregate id ${aggregateId}`;
  console.log(aggregateId);
  yield `aggregate`;

  const savedVotedUserIds = [];
  const savedCommnetCommentIds = [];
  for (let e = 0; e < nEvents; e++) {
    try {
      const commands = ["up_voted", "un_voted", "comment", "remove_comment"];
      const weights = [70, 10, 15, 5];

      const command = chooseWeighted(commands, weights);

      if (command === "up_voted") {
        const userId = uuid().toString();
        savedVotedUserIds.push(userId);
        await executeUpVoted(url, aggregateId, aggregateName, userId);
        await delay(delayMs);
      } else if (command === "un_voted") {
        const [userId] = popElement(savedVotedUserIds);
        if (!userId) {
          e--;
          // eslint-disable-next-line no-continue
          continue;
        }
        await executeUnVoted(url, aggregateId, aggregateName, userId);
        await delay(delayMs);
      } else if (command === "comment") {
        const userId = uuid().toString();
        const commentId = uuid().toString();
        savedCommnetCommentIds.push(commentId);
        const name = faker.name.findName();
        await executeComment(url, aggregateId, aggregateName, commentId, {
          userId,
          name
        });
        await delay(delayMs);
      } else if (command === "remove_comment") {
        const [commentId] = popElement(savedCommnetCommentIds);
        if (!commentId) {
          e--;
          // eslint-disable-next-line no-continue
          continue;
        }
        await executeRemoveComment(url, aggregateId, aggregateName, commentId);
        await delay(delayMs);
      }
      yield command;
    } catch (err) {
      console.error(err.message);
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
        message: "How many iteration do you want? ",
        default: 20
      },
      async result => {
        const url = `${args.options.url}/command-handler`;
        this.log(`Ok, ${args.aggregateName} with ${result.nEvents} iterations`);
        const stats = {
          aggregate: 0,
          up_voted: 0,
          un_voted: 0,
          comment: 0,
          remove_comment: 0
        };
        // eslint-disable-next-line no-restricted-syntax
        for await (const itemName of generateNewsAggregate(
          url,
          result.nEvents,
          2
        )) {
          stats[itemName]++;
        }
        this.log(
          `Generated ${stats.aggregate} aggregati, 
          ${stats.up_voted} up voted, 
          ${stats.un_voted} un voted, 
          ${stats.comment} comments, 
          ${stats.remove_comment} comments removed`
        );
        callback();
      }
    );
  });

vorpal.show().parse(process.argv);
