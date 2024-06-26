import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
    .connect('mongodb+srv://eugene:wwwwww@cluster0.vw32mqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("DB OK"))
    .catch((err) => console.log("DB Error", err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.post("/auth/login", (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
        email: req.body.email,
        fullName: "Eugene Smit",
    }, 'secret key')

    res.json({
        success: true,
        token: token,
    });
})

app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log("SERVER RUN SUCCESSFULLY");
});