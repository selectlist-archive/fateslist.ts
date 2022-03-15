import getResponseBody from 'raw-body';
import { Request, Response, NextFunction } from 'express';
import { WebhookPayload } from '../../typings';
import { URLSearchParams } from 'url';

export interface WebhookOptions {
    error?: (error: Error) => void | Promise<void>;
}

export class Webhook {
    public options: WebhookOptions;
    constructor(private token?: string, options: WebhookOptions = {}) {
        this.options = {
            error: options.error ?? console.error,
        };
    }

    private _formatIncoming(body: WebhookPayload & { query: string }): WebhookPayload {
        const out: WebhookPayload = { ...body };
        if (body?.query?.length > 0) out.query = Object.fromEntries(new URLSearchParams(body.query));
        return out;
    }

    private _parseRequest(req: Request, res: Response): Promise<WebhookPayload | false> {
        return new Promise((resolve) => {
            if (this.token && req.headers.Authorization !== this.token) return res.status(403).json({ error: 'Unauthorized' });
            if (req.body) return resolve(this._formatIncoming(req.body));
            getResponseBody(req, {}, (error, body) => {
                if (error) return res.status(422).json({ error: 'Malformed Request!' });
                try {
                    const parsed = JSON.parse(body.toString('utf8'));
                    resolve(this._formatIncoming(parsed));
                } catch {
                    res.status(400).json({ error: 'Invalid Request Body!' })
                }
            });
        });
    }

    public hookListener(fn: (payload: WebhookPayload, req?: Request, res?: Response, next?: NextFunction) => void | Promise<void>) {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const response = await this._parseRequest(req, res);
            if (!response) return;
            try {
                await fn(response, req, res, next);
                if (res.headersSent) {
                    res.sendStatus(204);
                }
            } catch(err) {
                console.error(err);
                res.sendStatus(500);
            }
        };
    }

    public middleware() {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const response = await this._parseRequest(req, res);
            if (!response) return;
            res.sendStatus(204);
            req.votes = response;
            next();
        };
    }
}