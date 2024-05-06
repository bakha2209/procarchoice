const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const searchDataSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    }
});

module.exports = mongoose.model("Search", searchDataSchema);