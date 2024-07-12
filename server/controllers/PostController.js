import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js'

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1}).limit(5).exec();
        
        const rawTags = posts.map((obj) => obj.tags).flat();
        const uniqueTags = [...new Set(rawTags)].filter((tag) => tag.trim() != "");
        const tags = uniqueTags.slice(0, 5);
        
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить теги",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').sort({ createdAt: -1}).exec();
 
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
};

export const getPopular = async(req, res) => {
    try {
        const posts = await PostModel.find().populate('user').sort({ viewsCount: -1}).exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить популярные посты",
        });
    }
};

export const getByTag = async(req, res) => {
    try {
        const tag = req.params.tag;
        const posts = await PostModel.find({ tags: tag }).populate('user').exec();
        
        res.json(posts);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndUpdate(
        {
            _id: postId,
        },
        {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after',
        }).populate('user').then(
        (doc) => {
            if(!doc){
                return res.status(404).json({
                    message: 'Статья не найдена',
                });
            }

            res.json(doc);
        }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью', 
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(/\s*,\s*/),
            user: req.userId,
        });
        
        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью",
        });
    }
}; 

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findById(postId);

        if(doc.user != req.userId){
            return res.status(403).json({
                message: 'Чужую статью удалить нельзя',
            });
        }
        
        await PostModel.findByIdAndDelete(postId);
        await CommentModel.deleteMany({ post: postId });
        
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findById(postId);

        if(!doc){
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        if(doc.user != req.userId){
            return res.status(403).json({
                message: 'Нельзя редактировать чужую статью',
            });
        }

        await PostModel.updateOne(
        {
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags.split(/\s*,\s*/),
        },
        );

        res.json({
            success: true,
        });        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
}
