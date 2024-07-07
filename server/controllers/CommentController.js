import CommentModel from '../models/Comment.js';

export const getLasts = async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('user').limit(5).exec();
        
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
        console.log(postId);
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
        console.log(doc);
        const comment = await doc.save();

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

        if(!doc){
            return res.status(404).json({
                message: 'Комментарий не найден',
            });
        }

        if(doc.user != req.userId){
            return res.status(403).json({
                message: 'Чужой комментарий нельзя удалить'
            });
        }

        await CommentModel.findByIdAndDelete(id);

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

