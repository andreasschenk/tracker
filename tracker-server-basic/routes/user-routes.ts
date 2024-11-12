import * as express from 'express';
import { v1 as uuidv1 } from 'uuid';

import {connection} from "../config/db";
import {User} from "../model/user";
import {Loc} from "../model/location";
import { ResultSetHeader, RowDataPacket} from "mysql2";

export const userRouter = express.Router();

const salt:string = "Spengergasse";

userRouter.post('/login/', (req, res, next) => {
    let sql = "Select (BIN_TO_UUID(id,1)) as id, username, email, firstname," +
        " lastname, sex, address, postalCode, city, country FROM `user` where user.username="
        + connection.escape(req.body.username) + " && user.password=SHA2("
        + connection.escape(req.body.password + salt) + ",512)";
    console.log(sql);
    connection.query<RowDataPacket[]>(sql, (err, rows) => {
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
    let sql:string = "INSERT INTO  user  (id, username, password, email) VALUES (UUID_TO_BIN('" + uuid + "',1), " + connection.escape(req.body.username) +
        ", SHA2(" + connection.escape(req.body.password + salt) + ",512), " + connection.escape(req.body.email) + ");"
    try {
        console.log(sql);
        connection.query<ResultSetHeader>(sql, (err, rows) => {
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
            " VALUES (UUID_TO_BIN('" + uuid + "',1), UUID_TO_BIN(" +  connection.escape(req.body.userid)
            + ",1)," + connection.escape(req.body.latitude)
            + "," + connection.escape(req.body.longitude) + "," + connection.escape(new Date(req.body.time)) + ");"
        //console.log(sql);
        connection.query<ResultSetHeader>(sql, (err, rs) => {
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
            + connection.escape(req.params.id) + ",1) AND location.userid=user.id;"
        //console.log(sql);
        connection.query<RowDataPacket[]>(sql, (err, rows) => {
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
    let sql = "UPDATE user SET firstname = " + connection.escape(req.body.firstName)
        + ", lastname = " + connection.escape(req.body.lastName)
        + ", sex = " + connection.escape(req.body.sex)
        + ", address = " + connection.escape(req.body.address)
        + ", postalcode = " + connection.escape(req.body.postalCode)
        + ", city = " + connection.escape(req.body.city)
        + ", country = " + connection.escape(req.body.country)
        + " WHERE id = UUID_TO_BIN(" + connection.escape(req.body.id)+ ",1);";
    console.log(sql);
    connection.query<ResultSetHeader>(sql,  (err) => {
        if(err) next(err);
        res.status(200).send(null);
    })
})
