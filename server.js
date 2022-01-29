const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const PORT = process.env.PORT || 3001;

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

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    title,
    text,
    id: uuid.v4(),
  };

  fs.readFile("./db/db.json", (err, data) => {
    const notes = JSON.parse(data);
    if (err) {
      console.error(err);
    } else {
      notes.push(newNote);
      const noteString = JSON.stringify(notes, null, 4);
      fs.writeFile("./db/db.json", noteString, (err) =>
        err ? console.error(err) : res.json(newNote)
      );
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    const notes = JSON.parse(data);
    if (err) {
      console.error(err);
    } else {
      const filterNotes = notes.filter((note) => {
        return note.id !== req.params.id;
      });
      console.log(filterNotes);
      fs.writeFile("./db/db.json", JSON.stringify(filterNotes), (err) =>
        err ? console.error(err) : res.json(notes)
      );
    }
  });
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
