// Answer Document Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_by_Id: { type: mongoose.Schema.Types.ObjectId },
    ans_date_time: { type: Date, required: false, default: Date.now },
    votes: { type: Number, default: 0 },
    comments: { type: Array, default: [] },
});

module.exports = mongoose.model("Answer", answerSchema);
