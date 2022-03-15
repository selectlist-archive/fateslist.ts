export type Snowflake = string;

export interface BotInfo {

}

export interface BotStats {
    guild_count?: number,
    shard_count?: number,
    shards?: number
}

export interface WebhookPayload {
    id: Snowflake,
    votes: number,
    test: boolean,
    mode: string,
    payload: string 
}