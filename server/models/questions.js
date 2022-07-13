// Question Document Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    tags: { type: Array, required: true },
    answers: { type: Array, required: false },
    asked_by: { type: String, required: false, default: "Anonymous" },
    asked_by_Id: { type: mongoose.Schema.Types.ObjectId },
    ask_date_time: { type: Date, required: false, default: Date.now },
    views: { type: Number, required: false, default: 0 },
    votes: { type: Number, default: 0 },
    summary: { type: String },
    comments: { type: Array },
});

module.exports = mongoose.model("Question", questionSchema);
