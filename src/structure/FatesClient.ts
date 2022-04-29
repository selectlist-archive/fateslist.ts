import fetch from "node-fetch";
import { Logger } from "@ayanaware/logger";

export default class FatesClient {
    private apikey: String;
    private botID: String;

    constructor(options = {
        token: "",
        botID: ""
    }) {
        this.apikey = options.token;
        this.botID = options.botID;

    };

    async post(guild_count?: Number, shard_count?: Number, user_count?: Number, shards?: []) {

        if (!this.apikey) throw new ReferenceError("[Fates API]: Invalid or Missing Auth Token");
        if (!this.botID) throw new ReferenceError("[Fates API]: Invalid or Missing Server Count. Should be a Valid Integer.");

        if (!guild_count) guild_count = 0;
        if (!shard_count) shard_count = 0;
        if (!user_count) user_count = 0;
        if (!shards) shards = [];

        await fetch(`https://api.fateslist.xyz/bots/${this.botID}/stats`, {
            method: "POST",
            headers: {
                "Authorization": `${this.apikey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                guild_count: guild_count,
                shard_count: shard_count,
                user_count: user_count,
                shards: shards

            })
        });
    };
    /**
     * 
     * @param text Nothing special just for logging custom text
     */
    log(text?: String) {
        if (!text) text = "[Fates API]: Online and Ready to Post Stats";

        var log = Logger.get();
        log.info(`${text}`);
    };
};
