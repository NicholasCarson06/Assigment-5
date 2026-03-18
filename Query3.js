const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const DB = "ieeevisTweets";

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db(DB);
    const collection = db.collection("tweet");

    const results = await collection
      .aggregate([
        {
          $group: {
            _id: "$user.screen_name",
            tweet_count: { $sum: 1 },
          },
        },
        { $sort: { tweet_count: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const top = results[0];
    console.log(
      `Person with the most tweets: @${top._id} with ${top.tweet_count} tweets`
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
