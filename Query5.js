const { MongoClient } = require("mongodb");
const URI = "mongodb://localhost:27017";
const DB = "ieeevisTweets";

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db(DB);
    const tweets = db.collection("tweet");

    // Step 1: Create Users collection with all unique users
    console.log("Creating Users collection...");
    const users = await tweets.aggregate([
      { $group: { _id: "$user.id", user: { $first: "$user" } } },
      { $replaceRoot: { newRoot: "$user" } }
    ]).toArray();
    await db.collection("users").deleteMany({});
    await db.collection("users").insertMany(users);
    console.log(`Inserted ${users.length} unique users`);

    // Step 2: Create Tweets_Only collection referencing user by user_id
    console.log("Creating Tweets_Only collection...");
    const tweetDocs = await tweets.aggregate([
      { $addFields: { user_id: "$user.id" } },
      { $project: { user: 0 } }
    ]).toArray();
    await db.collection("Tweets_Only").deleteMany({});
    await db.collection("Tweets_Only").insertMany(tweetDocs);
    console.log(`Inserted ${tweetDocs.length} tweets into Tweets_Only`);

    console.log("Done! Collections created: users, Tweets_Only");
  } finally {
    await client.close();
  }
}
main().catch(console.error);
