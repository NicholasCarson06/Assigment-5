const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const DB = "ieeevisTweets";

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db(DB);
    const collection = db.collection("tweet");

    // Not a retweet: retweeted_status field does not exist
    // Not a reply: in_reply_to_status_id is null
    const count = await collection.countDocuments({
      retweeted_status: { $exists: false },
      in_reply_to_status_id: null,
    });

    console.log(`Tweets that are NOT retweets or replies: ${count}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
