import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from "./validations.js";

import { checkAuth, handleValidationErrors } from './utils/index.js';

import { PostController, UserController, CommentController } from './controllers/index.js';


mongoose
    .connect('mongodb+srv://eugene:wwwwww@cluster0.vw32mqv.mongodb.net/kbank?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("DB OK"))
    .catch((err) => console.log("DB Error", err)
);

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/popular", PostController.getPopular);
app.get("/posts/:id", PostController.getOne);
app.get("/posts/tags/:tag", PostController.getByTag);
app.post("/posts/", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.get('/comments', CommentController.getLast);
app.get('/comments/:postId', CommentController.getCommentsByPostId);
app.get('/comments/count/:postId', CommentController.getCount);
app.post('/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.delete('/comments/:id', checkAuth, CommentController.remove);

app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }

    console.log("SERVER RUN SUCCESSFULLY");
});