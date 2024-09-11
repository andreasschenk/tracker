"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
const user_routes_1 = require("./routes/user-routes");
const https_1 = __importDefault(require("https"));
const fs = __importStar(require("node:fs"));
const app = (0, express_1.default)();
const port = config_1.default.get('appConfig.port');
const origin = config_1.default.get('appConfig.origin');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: origin }));
app.use('/users', user_routes_1.userRouter);
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.error("error!!!" + err);
    res.status(500).send('Something broke!  ' + err);
}
app.use(errorHandler);
const server = https_1.default.createServer({
    key: fs.readFileSync('./mkcert/localhost+3-key.pem'),
    cert: fs.readFileSync('./mkcert/localhost+3.pem'),
}, app);
server.listen(port, "127.0.0.1", () => {
    console.log(`Example app listening on port ${port}`);
});
