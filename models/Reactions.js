const { Schema, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");


const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: "ENTER REACTION",
            maxLength: 280
        },
        username: {
            type: String,
            required: "USERNAME REQUIRED!",
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal),
        }
    }
);


module.exports = ReactionSchema;