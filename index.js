import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator"; 
import UserModel from "./models/User.js";


mongoose
    .connect('mongodb+srv://eugene:wwwwww@cluster0.vw32mqv.mongodb.net/kbank?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("DB OK"))
    .catch((err) => console.log("DB Error", err)
);

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
		    email: req.body.email,
		    fullName: req.body.fullName,
		    avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
	    });

        const user = await doc.save();

        const token = jwt.sign(
        {
            _id: user._id,
        },
        "secretKey",
        {
            expiresIn: '30d',
        }, 
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
});

app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log("SERVER RUN SUCCESSFULLY");
});