const express = require('express');
const api = express();

const authRouter=require('../routes/auth');
const dataRouter=require("../routes/data");
const modifyRouter=require("../routes/modify");

const  {v4: uuidv4} = require("uuid");
const bcrypt = require('bcrypt');

const db = require('../db/conn');

api.use(express.json());

api.use(express.urlencoded({extended:true}));

api.use("/api",authRouter);
api.use("/api/read",dataRouter);
api.use("/api/modify",modifyRouter);







module.exports = api;