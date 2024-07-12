import mongoose from "mongoose";
import CommentModel from "./Comment.js";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required : true,
        unique: true
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String,
},
{
    timestamps: true,
},
);

// PostSchema.pre('remove', async function (next) {
//     try {
//         await CommentModel.deleteMany({ post: this._id });
//         console.log("Variant 1")
//         next(); 
//     } catch (err) {
//         console.log("error: ", err);
//         next(err);
//     }
// });

export default mongoose.model('Post', PostSchema);