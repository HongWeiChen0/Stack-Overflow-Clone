// User Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true, "Please enter a name"] },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    reputation: {
        type: Number,
        default: 0,
    },
    registerationTime: {
        type: Date,
        default: Date.now,
    },
    upvoted: {
        type: Array,
        default: [],
    },
    downvoted: {
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model("User", userSchema);
