const express = require('express');
const { connectToDb, getDb } = require('./db');
const cors = require('cors');
const { ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

let db;

connectToDb((err) => {
  if (err) {
    console.error('Error occurred while connecting to the database:', err);
    return;
  }
  console.log('Connected successfully to the database');

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });

  db = getDb();
});

app.post('/add', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).send('Database not connected');
    }

    const text = req.body;

    const result = await db.collection('data').insertOne(text);
    
    res.status(200).send('Data added successfully');
  } catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/get', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).send('Database not connected');
    }

    const results = await db.collection('data').find().toArray();

    if (!results || results.length === 0) {
      return res.status(404).send('No data found');
    }

    const textData = results.map((result) => result.text);
    console.log(textData);
    res.status(200).json({ textData });
  } catch (error) {
    console.error('Error occurred while retrieving data:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = app;
