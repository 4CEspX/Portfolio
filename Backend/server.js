// Backend/server.js

import cors from "cors";
import express from "express";

import Database from "better-sqlite3";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import argon2 from "argon2";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const db = new Database("./database.db");

// Hashing the password
const hashPassword = async (password) => {
  try {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    return hash;
  } catch (error) {
    // Handle hashing error
    console.error("Error hashing password:", error.message);
    throw error;
  }
};

// Verifying the password
const verifyPassword = async (hashedPassword, password) => {
  try {
    const isMatch = await argon2.verify(hashedPassword, password);
    return isMatch;
  } catch (error) {
    // Handle verification error
    console.error("Error verifying password:", error.message);
    throw error;
  }
};

const prepareCache = new Map();
const prepare = (query) => {
  if (prepareCache.has(query)) {
    return prepareCache.get(query);
  }

  const stmt = db.prepare(query);
  prepareCache.set(query, stmt);
  return stmt;
};

// Other Tables
const setupRolesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT
)
`);

setupRolesTable.run();

const setupUsersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role INTEGER NOT NULL,
    class_id TEXT
)
`);

setupUsersTable.run();

const setupClassesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)
`);

setupClassesTable.run();

const setupRoomTable = db.prepare(`
CREATE TABLE IF NOT EXISTS room (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)
`);

setupRoomTable.run();

const setupTagsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_id TEXT,
    room_id INTEGER NOT NULL
)
`);

setupTagsTable.run();

const setupLecturesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS lectures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER,
    start_time TIME,
    end_time TIME,
    teacher_id TEXT NOT NULL,
    room_id INTEGER NOT NULL
)
`);

setupLecturesTable.run();

const setupUsersLecturesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS users_lectures (
  user_id INTEGER NOT NULL,
  lecture_id INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

setupUsersLecturesTable.run();

// Users
app.post("/api/users", async (req, res) => {
  console.log(req.body);
  const insertDataQuery = prepare(
    "INSERT INTO users (username, password, role, class_id) VALUES (?, ?, ?, ?)"
  );
  const checkUserQuery = prepare("SELECT id FROM users WHERE username = ?");
  try {
    if (
      !req.body.username ||
      !req.body.password ||
      !req.body.role ||
      !req.body.class_id
    ) {
      res.status(400).json({ error: "Incomplete data" });
      return;
    }
    const existingUser = checkUserQuery.get(req.body.name);

    if (existingUser) {
      res.status(409).json({
        error: "User with the same name already exists",
      });
      return;
    }
    const hashedPassword = await hashPassword(req.body.password);

    insertDataQuery.run(
      req.body.username,
      hashedPassword,
      req.body.role,
      req.body.class_id
    );
    res.cookie("loggedIn", existingUser.id, { maxAge: 9000000000 });

    res.json("User data inserted successfully and cookie sent!");
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Roles
app.post("/api/roles", (req, res) => {
  const insertDataQuery = prepare("INSERT INTO roles (role) VALUES (?)");
  if (!req.body.role) {
    res.status(400).json({ error: "Incomplete data" });
    return;
  }
  insertDataQuery.run(req.body.role);
  res.json("Role data inserted successfully");
});

// Classes
app.post("/api/classes", (req, res) => {
  const insertDataQuery = prepare("INSERT INTO classes (name) VALUES (?)");
  if (!req.body.name) {
    res.status(400).json({ error: "Incomplete data" });
    return;
  }
  insertDataQuery.run(req.body.name);
  res.json("Class data inserted successfully");
});

// Room
app.post("/api/room", (req, res) => {
  const checkRoomQuery = prepare("SELECT id FROM room WHERE name = ?");
  const insertDataQuery = prepare("INSERT INTO room (name) VALUES (?)");
  if (!req.body.name) {
    res.status(400).json({ error: "Incomplete data" });
    return;
  }
  const existingRoom = checkRoomQuery.get(req.body.name);

  if (existingRoom) {
    res.status(409).json({
      error: "Room with the same name already exists",
      roomId: existingRoom.id,
    });
    return;
  }

  insertDataQuery.run(req.body.name);
  res.json("Room data inserted successfully");
});

// Tags
app.post("/api/tags", (req, res) => {
  console.log(req.body);
  const insertDataQuery = prepare(
    "INSERT INTO tags (tag_id, room_id) VALUES (?, ?)"
  );
  const checkRoomQuery = prepare("SELECT id FROM room WHERE name = ?");
  const checkTagsQuery = prepare("SELECT tag_id FROM tags WHERE tag_id = ?");
  const DelTagsQuery = prepare("DELETE FROM tags WHERE tag_id = ?");
  const checkRoomsQuery = prepare("SELECT name FROM room WHERE name = ?");

  if (!req.body.tag_id || !req.body.room) {
    res.status(400).json({ error: "Incomplete data" });
    console.log("Incomplete data!");
    return;
  }

  const tagId = req.body.tag_id;
  const room = req.body.room;
  const roomId = checkRoomQuery.get(room);

  const tag = checkTagsQuery.get(req.body.tag_id);

  if (checkRoomsQuery.get(req.body.room) == null) {
    res.status(409).json("Room does not exist!");
    console.log("Room does not exist!");
    return;
  }

  if (tag == null) {
    insertDataQuery.run(tagId, roomId.id);
    res.json("Tag data inserted successfully");
  } else {
    DelTagsQuery.run(tagId);
    insertDataQuery.run(tagId, roomId.id);
  }
});

// Lectures
app.post("/api/lectures", (req, res) => {
  const insertDataQuery = prepare(
    "INSERT INTO lectures (day, start_time, end_time, teacher_id, room_id) VALUES (?, ?, ?, ?, ?)"
  );
  if (
    !req.body.day ||
    !req.body.start_time ||
    !req.body.end_time ||
    !req.body.teacher_id ||
    !req.body.room_id
  ) {
    res.status(400).json({ error: "Incomplete data" });
    return;
  }
  insertDataQuery.run(
    req.body.day,
    req.body.start_time,
    req.body.end_time,
    req.body.teacher_id,
    req.body.room_id
  );
  res.json("Lecture data inserted successfully");
});

// Users-Lectures
app.post("/api/users-lectures", (req, res) => {
  // res.clearCookie("loggedIn")
  const uid = req.cookies.loggedIn;
  console.log(req.body);
  if (uid == undefined) {
    console.log("uid", uid)
    res.status(401).json("Not logged in!")
    return;
  }

  console.log("uid2", uid, req.cookies)

  const insertDataQuery = prepare(
    "INSERT INTO users_lectures (user_id, lecture_id) VALUES (?, ?)"
  );
  const checkTagQuery = prepare(
    "SELECT room_id FROM tags WHERE tag_id = ?"
  )
  if (!req.body.tag_id) {
    res.status(400).json({ error: "Incomplete data" });
    return;
  }
  const roomId = checkTagQuery.get(req.body.tag_id.id);
  if (!roomId)
  {
    res.status(400);
    return;
  }

  console.log("User: ",uid, roomId);
  insertDataQuery.run(uid, roomId.room_id);
  res.status(200).json("Logged the scan!");
});

// Login
app.post("/api/login", (req, res) => {
  console.log(req.body);
  const checkPasswordQuery = prepare(
    "SELECT password, id FROM users WHERE username = ?"
  );
  const checkRoleQuery = prepare("SELECT role FROM users WHERE username = ?");
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ error: "Incomplete data" });
    return;
  }
  const existingUser = checkPasswordQuery.get(req.body.username);
  const hashedPassword = existingUser.password;
  const userRole = checkRoleQuery.get(req.body.username);

  if (!existingUser) {
    res.status(409).json({
      error: "User not found!",
    });
    return;
  }
  const isPasswordMatch = verifyPassword(hashedPassword, req.body.password);
  if (isPasswordMatch) {
    console.log("loggy", existingUser)
    res.cookie("loggedIn", existingUser.id, { maxAge: 9000000000 });
    res.status(200).json(userRole);
    console.log(userRole);

    console.log("Password is correct and cookie sent!");
    return;
  }
  res.status(409).json({ error: "Password is incorrect" });
  console.log("Password is incorrect");
});

// Route to get all users
app.get("/api/users", (req, res) => {
  const query = db.prepare("SELECT * FROM users");
  const users = query.all();
  res.cookie("myCookie", "cookieValue");
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(function (req, res) {
  res.status(404);
});
