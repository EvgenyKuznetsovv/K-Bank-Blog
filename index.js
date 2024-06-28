import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation } from "./validations.js";
import checkAuth  from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js"

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

app.post("/auth/register", registerValidation, UserController.register);
app.post("/auth/login", loginValidation, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe)

app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log("SERVER RUN SUCCESSFULLY");
});