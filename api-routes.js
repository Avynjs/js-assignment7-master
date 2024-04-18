// api-routes.js

const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URL
const url = process.env.MONGODB_URL || require('./secrets/mongodb.json').url;
const client = new MongoClient(url);

// Connect to MongoDB and get the todos collection
const getCollection = async (dbName, collectionName) => {
    await client.connect();
    return client.db(dbName).collection(collectionName);
};

// Define routes

// GET /api/todos

router.get('/api/todos', async (_, res) => {

    try {
        const collection = await getCollection('todo-api', 'todos');
        const todos = await collection.find().toArray();
        response.json(todos);
    } catch (error) {
        console.error('Error getting todos:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/todos
router.post('/api/todos', async (req, res) => {
    try {
        const { item, complete } = req.body;
        const collection = await getCollection('todo-api', 'todos');
        const result = await collection.insertOne({ item, complete });
        res.json(result.ops[0]);
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/todos/:id
router.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await getCollection('todo-api', 'todos');
        const todo = await collection.findOne({ _id: new ObjectId(id) });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const complete = !todo.complete;
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { complete } }
        );

        res.json({ message: 'Todo updated successfully' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = { getCollection, ObjectId, router} 
