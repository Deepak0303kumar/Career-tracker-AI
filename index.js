require("dotenv").config();

const express = require("express");
const cors = require("cors");
const api = require("./config/prisma");

const app = express();

app.use(cors());
app.use(express.json());

// GET - Get all todos
app.get("/todos", async (req, res) => {
const todos = await api.todo.findMany({
orderBy: {
createdAt: "desc",
},
});

res.json(todos);
});

// GET - Get single todo
app.get("/todos/:id", async (req, res) => {
const id = Number(req.params.id);

const todo = await api.todo.findUnique({
where: { id },
});

res.json(todo);
});

// POST - Create todo
app.post("/todos", async (req, res) => {
const { title, description } = req.body;

const todo = await api.todo.create({
data: {
title,
description,
},
});

res.status(201).json(todo);
});

// POST - Mark complete
app.post("/todos/:id/complete", async (req, res) => {
const id = Number(req.params.id);

const todo = await api.todo.update({
where: { id },
data: {
completed: true,
},
});

res.json(todo);
});

// POST - Delete todo
app.post("/todos/:id/delete", async (req, res) => {
const id = Number(req.params.id);

await api.todo.delete({
where: { id },
});

res.json({
message: "Todo deleted",
});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});