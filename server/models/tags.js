// Tag Document Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: { type: String, required: true },
    created_by_Id: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model("Tag", tagSchema);
