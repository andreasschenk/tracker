import * as express from 'express';
import { v1 as uuidv1 } from 'uuid';

import {pool} from "../config/db";
import {User} from "../model/user";
import {Loc} from "../model/location";
import {QueryResult, RowDataPacket} from "mysql2";

export const userRouter = express.Router();

const salt:string = "Spengergasse";

userRouter.post('/login/', (req, res, next) => {
    let sql = "Select (BIN_TO_UUID(id,1)) as id, username, email, firstname," +
        " lastname, sex, address, postalCode, city, country FROM `user` where user.username="
        + pool.escape(req.body.username) + " && user.password=SHA2("
        + pool.escape(req.body.password + salt) + ",512)";
    console.log(sql);
    pool.query<RowDataPacket[]>(sql, (err, rows) => {
        if (err) next(err);
        let data: User | null;
        if (rows.length > 0) {
            data = new User(rows[0].id, rows[0].username, rows[0].email,
                rows[0].firstname, rows[0].lastname, rows[0].sex, rows[0].address,
                rows[0].postalcode, rows[0].city, rows[0].country);
            res.status(200).send(data);
        } else
            res.status(404).send({error: 'User/PW not found'});
    })
})
userRouter.post('/register/', (req, res, next) => {
    let uuid:string = uuidv1();
    let sql:string = "INSERT INTO  user  (id, username, password, email) VALUES (UUID_TO_BIN('" + uuid + "',1), " + pool.escape(req.body.username) +
        ", SHA2(" + pool.escape(req.body.password + salt) + ",512), " + pool.escape(req.body.email) + ");"
    try {
        console.log(sql);
        pool.query<QueryResult>(sql, (err, rows) => {
            if (err) next(err);
            else {
                if (rows.affectedRows > 0)  // ???
                {
                    res.status(200).send({id:uuid});
                } else res.status(400).send({error: "User already exists"}) ;
            }
        })
    } catch (err) {
        next(err);
    }
})
userRouter.post('/location/', (req,
                               res, next) => {
    try {
        let uuid = uuidv1();
        let sql = "INSERT INTO  location  (id, userid, latitude, longitude, time)" +
            " VALUES (UUID_TO_BIN('" + uuid + "',1), UUID_TO_BIN(" +  pool.escape(req.body.userid)
            + ",1)," + pool.escape(req.body.latitude)
            + "," + pool.escape(req.body.longitude) + "," + pool.escape(new Date(req.body.time)) + ");"
        //console.log(sql);
        pool.query<QueryResult>(sql, (err, rs) => {
            if (err) next(err);
            else if (rs.affectedRows > 0)  // ???
            {
                let loc: Loc = new Loc(uuid, req.body.userid, req.body.latitude, req.body.longitude, req.body.time);
                //console.log(Object.entries(loc));
                res.status(200).send(loc);
            } else res.status(400).send({error: "location id already in db"})  ;
        });

    } catch (err) {
        next(err);
    }
})
userRouter.get('/locations/:id',
    (req,
     res, next) => {
        let data: Loc[] = [];
        let sql: string = "SELECT user.id as uid, location.id as lid, "
            + "location.latitude as lat, location.longitude as lng, location.time as time FROM location,user WHERE user.id=UUID_TO_BIN("
            + pool.escape(req.params.id) + ",1) AND location.userid=user.id;"
        //console.log(sql);
        pool.query<RowDataPacket[]>(sql, (err, rows) => {
            if (err) {
                next(err);
            } else {
                for (let i = 0; i < rows.length; i++)
                    data.push(new Loc(rows[i].lid, rows[i].uid, rows[i].lat, rows[i].lng, rows[i].time));
                //console.log(JSON.stringify(data));
                res.status(200).send(data);
            }
        })
    })
userRouter.put('/update/', (req,res,next) => {
    let sql = "UPDATE user SET firstname = " + pool.escape(req.body.firstName)
        + ", lastname = " + pool.escape(req.body.lastName)
        + ", sex = " + pool.escape(req.body.sex)
        + ", address = " + pool.escape(req.body.address)
        + ", postalcode = " + pool.escape(req.body.postalCode)
        + ", city = " + pool.escape(req.body.city)
        + ", country = " + pool.escape(req.body.country)
        + " WHERE id = UUID_TO_BIN(" + pool.escape(req.body.id)+ ",1);";
    console.log(sql);
    pool.query<QueryResult>(sql,  (err) => {
        if(err) next(err);
        res.status(200).send(null);
    })
})