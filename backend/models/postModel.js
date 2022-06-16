const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: {type: String, required: true},
        message: {type: String, maxlength: 500, trim: true},
        picture: {type: String},
        video: {type: String},
        likers: {types: [String]},
        comments: {
            type: [
                {commenterId: String, commenterPseudo: String, text: String, timestamp: Number}
            ],
            required: true
        }                  
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('post', PostSchema);