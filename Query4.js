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
        // Group by user, compute tweet count and average retweet count
        {
          $group: {
            _id: "$user.screen_name",
            tweet_count: { $sum: 1 },
            avg_retweets: { $avg: "$retweet_count" },
          },
        },
        // Only include users who tweeted more than 3 times
        { $match: { tweet_count: { $gt: 3 } } },
        // Sort by highest average retweets
        { $sort: { avg_retweets: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            screen_name: "$_id",
            tweet_count: 1,
            avg_retweets: { $round: ["$avg_retweets", 2] },
          },
        },
      ])
      .toArray();

    console.log(
      "Top 10 people with highest average retweets (more than 3 tweets):"
    );
    results.forEach((r, i) =>
      console.log(
        `${i + 1}. @${r.screen_name} — avg retweets: ${r.avg_retweets} (${r.tweet_count} tweets)`
      )
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
