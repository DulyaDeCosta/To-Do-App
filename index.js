const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("public"));

mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("Connected to db!");
        app.listen(3000, () => console.log("Server Up and running"));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.set("view engine", "ejs");

// Handle GET requests to the home page
app.get('/', async (req, res) => {
    try {
        const tasksresults = await TodoTask.find({});
        res.render("todo.ejs", { todoTasks: tasksresults });
    } catch (err) {
        res.status(500).send(err.message); // Proper status setting
    }
});

// Handle POST requests to add a new task
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send(err.message); // Proper status setting
    }
});

// Handle GET requests to remove a task
app.route("/remove/:id").get(async (req, res) => {
    try {
        const id = req.params.id;
        await TodoTask.findByIdAndDelete(id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send(err.message); // Proper status setting
    }
});

// Handle GET and POST requests for editing a task
app.route("/edit/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const taskedits = await TodoTask.find({});
            res.render("todoEdit.ejs", { todoTasks: taskedits, idTask: id });
        } catch (err) {
            res.status(500).send(err.message); // Proper status setting
        }
    })
    .post(async (req, res) => {
        const id = req.params.id;
        try {
            await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
            res.redirect("/");
        } catch (err) {
            res.status(500).send(err.message); // Proper status setting
        }
    });


// app.listen(3000,()=> console.log("Server up and running"));

