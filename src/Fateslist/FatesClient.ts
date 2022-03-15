import fetch, { Headers } from 'node-fetch';
import FL_Error from '../Errors/ErrHandler';
import { EventEmitter } from 'events';
import { Snowflake, BotStats, BotInfo } from '../typings/index';
import e from 'express';

interface FL_Options {
    authToken?: string;
}

/**
 * FATE LIST CLIENT EXPORT
 */
export class FatesListClient extends EventEmitter {

    private options: FL_Options;

    constructor(auth: string, options: FL_Options = {}) {

        super();

        this.options = {
            authToken: auth,
            ...options
        };
    }

    /**
     * BASE REQUEST HANDLER
     */
    private async _request(method: string, path: string, body?: Record<string, any>): Promise<any> {

        const headers = new Headers();

        if (this.options.authToken) headers.set('Authorization', this.options.authToken);
        if (method !== 'GET') headers.set('Content-Type', 'application/json');

        let baseURL = `https://api.fateslist.xyz/${path}`;

        if (body && method === 'GET') baseURL += `${new URLSearchParams(body)}`;

        const response = await fetch(baseURL, {
            method, headers,
            body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
        });

        let responseBody;

        if (response.headers.get('Content-Type')?.startsWith('application/json')) {
            responseBody = await response.json();
        } else {
            responseBody = response.text();
        }

        if (!response.ok) {
            throw new FL_Error(response.status, response.statusText, response);
        }

        return responseBody;
    }

    /**
     * POST BOT STATISTICS (SERVERS AND SHARDS)
     */
     public async postStats(stats: BotStats, botID: Snowflake): Promise<BotStats> {

        if (!stats) throw new Error(`[Fates API] You didn\'t provide any stats to post.`);

        /* eslint-disable camelcase */
        await this._request('POST', `bots/${botID}`, {
            servers: stats.guild_count,
            shards: stats.shard_count
        });

        /* eslint-enable camelcase */

        return stats;
    }


}

