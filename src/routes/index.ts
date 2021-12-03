import {Express, Response, Request} from 'express';
import bodyParser from 'body-parser';
import log from "../logger";

let users = [
    {
        id: 1,
        name: "Rafael Salas Robledo",
        username: "rsalas",
        password: "rsalas.123"
    },
    {
        id: 2,
        name: "Mercedes Oliver Jiménez",
        username: "moliver",
        password: "moliver.123"
    },
    {
        id: 3,
        name: "Juan G. Hurtado Pecino",
        username: "jghurtado",
        password: "jghurtado.123"
    },
    {
        id: 4,
        name: "Raúl Recacha Camacho",
        username: "rrecacha",
        password: "rrecacha.123"
    },
]

const routes = (app: Express) => {
    const homepage = "<!DOCTYPE html> \
    <html lang='en'> \
    <head> \
        <meta charset='UTF-8'> \
        <meta http-equiv='X-UA-Compatible' content='IE=edge'> \
        <meta name='viewport' content='width=device-width, initial-scale=1.0'> \
        <title>Document</title> \
    </head> \
    <body> \
        <h1>Bienvenido al API Rest para gestionar deudas entre amigos</h1> \
    </body> \
    </html>";

    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (req: Request, res: Response) => {res.status(200).send(homepage);});

    app.get('/api/system/alive', (req: Request, res: Response) => {res.status(200).json({
      system: "API Rest to manage friend money debts",
      isAlive: true,
    });});
    
    app.get('/api/users', (req: Request, res: Response) => {
        res.status(200).json({users});
    });

    app.get('/api/users/:id', (req: Request, res: Response) => {
        const userId: number = Number(req.params.id);
        const user = users.find(user => user.id === userId);
        user ? res.status(200).json({user}) : res.status(404).end();
    });

    app.post('/api/users', (req: Request, res: Response) => {
        let userIds: number[] = users.map(user => user.id)
        let newUser = req.body;
        newUser = {id: Math.max(...userIds) + 1, ...newUser};
        users.push(newUser);
        res.status(200).json(newUser);
    });

    app.delete('/api/users/:id', (req: Request, res: Response) => {
        const userId: number = Number(req.params.id);
        let existUser = users.find(user => user.id === userId);
        if (existUser){
            users = users.filter(user => user.id !== userId);
            res.status(200).json(existUser);
        } else {
            res.status(404).json({error: 404, message: "User not found"});
        }
    });

    app.put('/api/users/:id', (req: Request, res: Response) => {
        const userId: number = Number(req.params.id);
        const newUser = req.body;
        let existUser = null;
        users = users.map(user => {
            if (user.id === userId) {
                existUser = {...user, ...newUser};
                return existUser;
            }
            return user;
        });
        
        existUser ? 
            res.status(200).json({existUser}) : 
            res.status(404).json({error: 404, message: "User not found"});
    });
}

export default routes;