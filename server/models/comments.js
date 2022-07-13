const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: { type: String, required: true },
    username: { type: String },
});

module.exports = mongoose.model("Comment", commentSchema);
