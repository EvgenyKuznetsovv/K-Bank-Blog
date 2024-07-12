import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const getLast = async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('user').sort({ createdAt: -1}).limit(5).exec();
        
        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить комментарии",
        });
    }
};

export const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        //console.log(postId);
        const comments = await CommentModel.find({ post: postId }).populate('user').exec();

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить",
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            user: req.userId,
            post: req.body.postId,
        });
        
        const comment = await doc.save();

        await PostModel.updateOne(
            { _id: req.body.postId },
            { $inc: { commentCount: 1 } }
        ).exec();

        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать комментарий',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await CommentModel.findById(id);

        if(doc.user != req.userId){
            return res.status(403).json({
                message: 'Чужой комментарий нельзя удалить'
            });
        }

        await CommentModel.findByIdAndDelete(id);

        await PostModel.updateOne(
            { _id: doc.post },
            { $inc: { commentCount: -1 } }
        ).exec();

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить комментарий',
        });
    }
};

export const getCount = async(req, res) => {
    try {
        const postId = req.params.postId

		const commentsCount = await CommentModel.countDocuments({ post: postId }).exec();

        res.send({
            count: commentsCount,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить количество комментариев',
        });
    }
}