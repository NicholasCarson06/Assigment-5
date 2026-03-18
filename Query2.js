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
            followers_count: { $max: "$user.followers_count" },
          },
        },
        { $sort: { followers_count: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            screen_name: "$_id",
            followers_count: 1,
          },
        },
      ])
      .toArray();

    console.log("Top 10 screen names by number of followers:");
    results.forEach((r, i) =>
      console.log(`${i + 1}. @${r.screen_name} — ${r.followers_count} followers`)
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
