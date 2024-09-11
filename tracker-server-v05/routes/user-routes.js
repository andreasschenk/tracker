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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express = __importStar(require("express"));
const uuid_1 = require("uuid");
const db_1 = require("../config/db");
const user_1 = require("../model/user");
const location_1 = require("../model/location");
exports.userRouter = express.Router();
const salt = "Spengergasse";
exports.userRouter.post('/login/', (req, res, next) => {
    let sql = "Select (BIN_TO_UUID(id,1)) as id, username, email, firstname," +
        " lastname, sex, address, postalCode, city, country FROM `user` where user.username="
        + db_1.pool.escape(req.body.username) + " && user.password=SHA2("
        + db_1.pool.escape(req.body.password + salt) + ",512)";
    console.log(sql);
    db_1.pool.query(sql, (err, rows) => {
        if (err)
            next(err);
        let data;
        if (rows.length > 0) {
            data = new user_1.User(rows[0].id, rows[0].username, rows[0].email, rows[0].firstname, rows[0].lastname, rows[0].sex, rows[0].address, rows[0].postalcode, rows[0].city, rows[0].country);
            res.status(200).send(data);
        }
        else
            res.status(404).send({ error: 'User/PW not found' });
    });
});
exports.userRouter.post('/register/', (req, res, next) => {
    let uuid = (0, uuid_1.v1)();
    let sql = "INSERT INTO  user  (id, username, password, email) VALUES (UUID_TO_BIN('" + uuid + "',1), " + db_1.pool.escape(req.body.username) +
        ", SHA2(" + db_1.pool.escape(req.body.password + salt) + ",512), " + db_1.pool.escape(req.body.email) + ");";
    try {
        console.log(sql);
        db_1.pool.query(sql, (err, rows) => {
            if (err)
                next(err);
            else {
                if (rows.affectedRows > 0) // ???
                 {
                    res.status(200).send({ id: uuid });
                }
                else
                    res.status(400).send({ error: "User already exists" });
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.userRouter.post('/location/', (req, res, next) => {
    try {
        let uuid = (0, uuid_1.v1)();
        let sql = "INSERT INTO  location  (id, userid, latitude, longitude, time)" +
            " VALUES (UUID_TO_BIN('" + uuid + "',1), UUID_TO_BIN(" + db_1.pool.escape(req.body.userid)
            + ",1)," + db_1.pool.escape(req.body.latitude)
            + "," + db_1.pool.escape(req.body.longitude) + "," + db_1.pool.escape(new Date(req.body.time)) + ");";
        //console.log(sql);
        db_1.pool.query(sql, (err, rs) => {
            if (err)
                next(err);
            else if (rs.affectedRows > 0) // ???
             {
                let loc = new location_1.Loc(uuid, req.body.userid, req.body.latitude, req.body.longitude, req.body.time);
                //console.log(Object.entries(loc));
                res.status(200).send(loc);
            }
            else
                res.status(400).send({ error: "location id already in db" });
        });
    }
    catch (err) {
        next(err);
    }
});
exports.userRouter.get('/locations/:id', (req, res, next) => {
    let data = [];
    let sql = "SELECT user.id as uid, location.id as lid, "
        + "location.latitude as lat, location.longitude as lng, location.time as time FROM location,user WHERE user.id=UUID_TO_BIN("
        + db_1.pool.escape(req.params.id) + ",1) AND location.userid=user.id;";
    //console.log(sql);
    db_1.pool.query(sql, (err, rows) => {
        if (err) {
            next(err);
        }
        else {
            for (let i = 0; i < rows.length; i++)
                data.push(new location_1.Loc(rows[i].lid, rows[i].uid, rows[i].lat, rows[i].lng, rows[i].time));
            //console.log(JSON.stringify(data));
            res.status(200).send(data);
        }
    });
});
