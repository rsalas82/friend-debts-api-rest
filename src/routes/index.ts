import {Express, Response, Request} from 'express';

const routes = (app: Express) => {
    app.get('/system/alive', (req: Request, res: Response) => {res.status(200);});
}

export default routes;