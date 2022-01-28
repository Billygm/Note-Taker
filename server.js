const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    const notes = JSON.parse(data);
    if (err) {
      console.error(err);
    } else {
      res.json(notes);
    }
  });
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
