"use strict";
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
const https_1 = __importDefault(require("https"));
const fs = __importStar(require("node:fs"));
const app = (0, express_1.default)();
const port = 4200;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//app.use(cors({origin:origin}))  ;
//app.use(cors());
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.error("error!!!" + err);
    res.status(500).send('Something broke!  ' + err);
}
app.use(errorHandler);
app.use(express_1.default.static('../tracker-client-v05/dist/tracker-client-v05/browser'));
const server = https_1.default.createServer({
    key: fs.readFileSync('./mkcert/localhost+3-key.pem'),
    cert: fs.readFileSync('./mkcert/localhost+3.pem'),
}, app);
server.listen(port, "127.0.0.1", () => {
    console.log(`Example app listening on port ${port}`);
});
