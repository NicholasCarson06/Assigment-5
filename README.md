# ieeevis2020 Tweets - MongoDB Assignment

## How to Load the Data

### Step 1 - Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Step 2 - Download the Tweet Data
Go to this URL in your browser and download the file:
```
https://johnguerra.co/viz/influentials/ieeevis2020/ieeevis2020Tweets.dump.bz2
```

### Step 3 - Unzip the File
```bash
bunzip2 ~/Downloads/ieeevis2020Tweets.dump.bz2
```

### Step 4 - Import into MongoDB
```bash
mongoimport -h localhost:27017 -d ieeevisTweets -c tweet --file ~/Downloads/ieeevis2020Tweets.dump
```
Expected output: `3325 document(s) imported successfully.`

### Step 5 - Install Node Dependencies
```bash
npm install
```

---

## Query 1 - How many tweets are NOT retweets or replies?

**File:** `Query1.js`

**Run:**
```bash
node Query1.js
```

**Approach:** Filters out documents where `retweeted_status` exists (retweets) and where `in_reply_to_status_id` is not null (replies).

**Result:** 1117 tweets

---

## Query 2 - Top 10 screen_names by number of followers

**File:** `Query2.js`

**Run:**
```bash
node Query2.js
```

**Approach:** Groups tweets by `user.screen_name`, takes the max `followers_count` per user, sorts descending, limits to 10.

**Result:**
1. @MSFTResearch — 513,811 followers
2. @darenw — 80,358 followers
3. @ComputerSociety — 57,455 followers
4. @AlbertoCairo — 57,407 followers
5. @visualisingdata — 50,158 followers
6. @RealGeneKim — 49,293 followers
7. @dataandme — 45,659 followers
8. @siggraph — 38,562 followers
9. @huggingface — 31,273 followers
10. @WorldProfessor — 29,717 followers

---

## Query 3 - Who is the person that got the most tweets?

**File:** `Query3.js`

**Run:**
```bash
node Query3.js
```

**Approach:** Groups by `user.screen_name`, counts total tweets per user, sorts descending, returns the top 1.

**Result:** @tmrhyne with 156 tweets

---

## Query 4 - Top 10 people with highest average retweets (tweeted more than 3 times)

**File:** `Query4.js`

**Run:**
```bash
node Query4.js
```

**Approach:** Groups by `user.screen_name`, calculates average `retweet_count` and total tweet count. Filters to only users with more than 3 tweets. Sorts by average retweets descending, limits to 10.

**Result:**
1. @DamonCrockett — avg retweets: 16.8 (5 tweets)
2. @antarcticdesign — avg retweets: 14 (4 tweets)
3. @mjskay — avg retweets: 13.83 (6 tweets)
4. @AlbertoCairo — avg retweets: 13.71 (7 tweets)
5. @chadstolper — avg retweets: 13.5 (4 tweets)
6. @miskaknapek — avg retweets: 12.86 (7 tweets)
7. @SlaveSocieties — avg retweets: 12.57 (7 tweets)
8. @domoritz — avg retweets: 12.5 (4 tweets)
9. @flekschas — avg retweets: 12.29 (7 tweets)
10. @KadekASatriadi — avg retweets: 12 (4 tweets)

---

## Query 5 - Separate Users into their own collection

**File:** `Query5.js`

**Run:**
```bash
node Query5.js
```

**Approach:**
- **Step 1:** Creates a `users` collection by extracting all unique user objects from the tweets, grouped by `user.id`.
- **Step 2:** Creates a `Tweets_Only` collection that removes the embedded `user` object and replaces it with a `user_id` field referencing the user's id.

**Result:**
- `users` collection: 1135 unique users
- `Tweets_Only` collection: 3325 tweets with `user_id` reference instead of embedded user object
