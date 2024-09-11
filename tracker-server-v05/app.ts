/*
changes: only uuid in db
timestamp is sent from client
use ts uuid https://github.com/uuidjs/uuid
bin uuid
https://dev.mysql.com/blog-archive/mysql-8-0-uuid-support/
encryption
https://www.sjoerdlangkemper.nl/2020/02/12/the-case-for-client-side-hashing-logging-passwords-by-mistake/#:~:text=This%20means%20that%20if%20the,hash%20effectively%20becomes%20the%20password.
https://security.stackexchange.com/questions/8596/https-security-should-password-be-hashed-server-side-or-client-side
https://dev.mysql.com/doc/mysql-security-excerpt/8.3/en/password-management.html
todo:
controller: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

dto or express validator or both???
https://blog.nevertoolate.studio/enhancing-node-js-backend-development-with-data-transfer-objects-dtos-889718871a61
https://abderahmanetoumi.medium.com/data-transfer-objects-dtos-a-comprehensive-guide-2d00e8fa2ec3
https://dev.to/tareksalem/dtos-in-javascript-118p
https://amirmustafaofficial.medium.com/data-transfer-objects-dto-pattern-in-programming-53f2a51a5cc9
https://medium.com/@hcach90/using-express-validator-for-data-validation-in-nodejs-6946afd9d67e
https://express-validator.github.io/docs/6.10.0/
https://medium.com/@chiragmehta900/node-js-typescript-validation-with-an-express-validator-72c164459d0f

db data: faker ...
 */

import express  from 'express';
import cors from 'cors';
import config from 'config';
import {userRouter} from "./routes/user-routes";
import https from 'https';
import * as fs from "node:fs";

const app = express();
const port: number = config.get<number>('appConfig.port');
const origin:string[] = config.get<string[]>('appConfig.origin');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:origin}))  ;

app.use('/users', userRouter);

function errorHandler(err:any, req:any, res:any, next:any)  {
    if (res.headersSent) {
        return next(err);
    }
    console.error("error!!!" + err);
    res.status(500).send('Something broke!  ' + err);
}
app.use(errorHandler);
const server = https.createServer({
    key: fs.readFileSync('./mkcert/localhost+3-key.pem'),
    cert: fs.readFileSync('./mkcert/localhost+3.pem'),
}, app);
server.listen(port, "127.0.0.1", () => {
    console.log(`Example app listening on port ${port}`)});
