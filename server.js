const express = require("express");
const mysqlDatabase = require('./mysqlDatabase');

const app = express();

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))


app.get("/", (req,res) => {
    res.render("index.ejs");
})

app.get("/notes", async (req, res) => {
  try {
    const notes = await mysqlDatabase.getNotes()
    res.render("notes.ejs", {notes})
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

app.get("/notes/:id", async (req, res) => {
  const id = req.params.id
  try {
    const note = await mysqlDatabase.getNote(id)
    res.render("singleNote.ejs", {note})
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

app.get("/createNote", (req, res) => {
  res.render("createNote.ejs")
})

app.post("/notes", async (req, res) => {
  try {
    const data = req.body;
    const title = data.title;
    const contents = data.contents
    await mysqlDatabase.addNote(title, contents)
    res.redirect("/notes");
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

app.post("/notes/:id/delete", async (req, res) => {
  try {
    const id = +req.params.id;
    await mysqlDatabase.deleteNote(id)
    res.redirect("/notes")
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }

})

app.use(express.static("public"))

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});