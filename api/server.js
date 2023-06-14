const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());

// For some reason, CORS by itself doesn't work in my Firefox
app.use(cors({
    origin: 'http://localhost:5173'
}));

mongoose.connect('mongodb://127.0.0.1:27017/mern-todo', {
    useNewUrlParser: true, // allows more formats for connection strings
    useUnifiedTopology: true // for more reliable and efficent connection
})
    .then(() => console.log("Successfully connected!"))
    .catch(console.error);

const Todo = require('./models/Todo');

// GET - get data from DB using the URL
// POST - push data to DB
// DELETE - delete data that matches criteria
// PUT - update / replace data that matches criteria

app.get('/todos', async(req, res) =>{
    const todos = await Todo.find();

    res.json(todos);
});

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })

    todo.save(); // save DB, duh

    res.json(todo);
})

app.put('/todo/update/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    todo.text = req.body.text;
    todo.save();

    res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) =>{
    const result = await Todo.findByIdAndDelete(req.params.id);

    res.json(result);
})

app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    todo.complete = !todo.complete;
    todo.save();
    
    res.json(todo);
})

app.listen(5174, () => console.log("Server started on port 5174"));