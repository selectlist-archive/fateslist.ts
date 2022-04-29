# Fates SDK
Types Friendly Node SDK for the Fates List API

---

## Install
```diff
+ npm
npm install fates-sdk
+ yarn
yarn add fates-sdk
```
## Usage
```js
const { FatesClient } = require("fates-sdk");

const fates = new FatesClient({
    token: "Api key", // Fates List API Token
    botID: "Bot id" // Bot ID to Post Stats For
});

/**
 * Post your Server and Shard Count
 */
fates.post("Total Numbers", "Total Shards");

/** 
 * Log a custom text to check if the package is working or not
 * It's not necessary
*/
fates.log("Text");
```

## Example
```js
const { FatesClient } = require("fates-sdk");

const client = new Sentcord({
    token: "E2BT0ivIoSgE4tEQdIJXVLv31n0mOlc5gn7XYVyUhZ9kONz3IkIhZP", 
    id: "967948529593122857"
});

/** Servers, Shards, Users, ShardArray */
fates.post(client.guilds.cache.size, client.shards.size, client.users.cache.size, [])
.then(() => {
    fates.log("[Fates API]: Stats have been posted chief!")
}).catch((err) => {
    fates.log(`[Fates API]: Failed to Post Bot Stats: ${err.stack}`)
});
```
