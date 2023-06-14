const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TL;DR
// Schema is used to define the structure of the DB
// and stores data in JSON-like documents

const TodoSchema = new Schema({
    text:{
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
})

// Creates the DB object
// This is what allows me to perform actions with the DB

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;