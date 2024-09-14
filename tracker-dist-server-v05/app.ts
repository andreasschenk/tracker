import express  from 'express';
import https from 'https';
import * as fs from "node:fs";
import cors from 'cors';

const app = express();
const port: number = 4200;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors({origin:origin}))  ;
//app.use(cors());

function errorHandler(err:any, req:any, res:any, next:any)  {
    if (res.headersSent) {
        return next(err);
    }
    console.error("error!!!" + err);
    res.status(500).send('Something broke!  ' + err);
}
app.use(errorHandler);

app.use(express.static('../tracker-client-v05/dist/tracker-client-v05/browser'));

const server = https.createServer({
    key: fs.readFileSync('./mkcert/localhost+3-key.pem'),
    cert: fs.readFileSync('./mkcert/localhost+3.pem'),
}, app);
server.listen(port, "127.0.0.1", () => {
    console.log(`Example app listening on port ${port}`)});
