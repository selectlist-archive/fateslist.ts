import response, { Headers } from 'node-fetch'

const tips = {
    200: 'Okay, your stats have been posted!',
    400: 'Error processing request: Invalid Input or Misc Error',
    401: 'Whoops, You are not authorized to view the requested data.',
    403: 'Hmm, Seems like you provided a Invalid API Token. Please try again or Generate a new Token',
    408: 'Sorry it seems our website is currently down for Maintenance or experiencing a Critical Error. Please try again later!',
    429: 'You are being RateLimited. Please try your request again later. This usually doesn\'t last long.'
}

export default class FL_Error extends Error {
    public response? : Response;
    constructor(status: number, message: string, response: Response) {
        if (status in tips) {
            super(`${status} ${message} (${tips[status as keyof typeof tips]})`);
        } else {
            super(`${status} ${message}`);
        }
        this.response = response;
    }
}