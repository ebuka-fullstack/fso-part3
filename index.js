const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


morgan.token("body", (req) => {
  if (req.method === "POST" && req.body) {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phonebook = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get("/api/phonebook", (req, res) => {
  res.json(phonebook);
});


app.delete("/api/phonebook/:id", (req, res) => {
  const id = req.params.id;

  const entryIndex = phonebook.findIndex(entry => entry.id === id);

  if (entryIndex === -1) {
    return res.status(404).json({ error: "Entry not found" });
  }
  const deletedEntry = phonebook.splice(entryIndex, 1);
  res.json({ message: "Entry deleted", deletedEntry: deletedEntry[0] });
});


app.post("/api/phonebook", (req, res) => {
  console.log("BODY:", req.body);
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const newPerson = {
    id: String(phonebook.length + 1),
    name,
    number,
  };

  phonebook = phonebook.concat(newPerson);

  res.status(200).json(newPerson);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});