// Backend/server.js

import cors from "cors";
import express from "express";

import Database from "better-sqlite3";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new Database("./database.db");

const prepareCache = new Map();
const prepare = (query) => {
  if (prepareCache.has(query)) {
    return prepareCache.get(query);
  }

  const stmt = db.prepare(query);
  prepareCache.set(query, stmt);
  return stmt;
};

const setupProjectsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT NOT NULL
)
`);
setupProjectsTable.run();

const setupReviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS reviews (
  projectId INTEGER NOT NULL,
  name TEXT NOT NULL,
  review TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);
setupReviewsTable.run();

app.post("/api/projects", (req, res) => {
  const insertDataQuery = prepare("INSERT INTO projects (title, description, link) VALUES (?, ?, ?)");
  if (!req.body.title || !req.body.description || !req.body.link) {
    res.status(400).json({ error: "Incomplete data!" });
    return;
  }
  insertDataQuery.run(req.body.title, req.body.description, req.body.link);
  res.json("Projects data inserted successfully!");
});

app.post("/api/reviews", (req, res) => {
  const insertDataQuery = prepare("INSERT INTO reviews (projectId, name, review) VALUES (?, ?, ?)");
  if (!req.body.projectId || !req.body.name || !req.body.review) {
    res.status(400).json({ error: "Incomplete data!" });
    return;
  }
  insertDataQuery.run(req.body.projectId, req.body.name, req.body.review);
  res.json("Review inserted successfully!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(function (req, res) {
  res.status(404);
});
