const express = require("express");
const app = express();
var morgan = require("morgan");

app.use(express.static('dist'));

let entries = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.use(express.json());
morgan.token('data', (req,res) => {
  return JSON.stringify(req.body)
})

app.get("/api/persons", (request, response) => {
  response.json(entries);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get("/info", (request, response) => {
  const date = new Date();
  let now = `${date.toDateString()} ${date.toTimeString()}`;
  const people = entries.length;
  response.send(
    `<p>Phonebook has info for ${people} people<p/>
     <p>${now}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const find = entries.find((en) => en.id === id);
  if (find) {
    response.json(find);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  entries = entries.filter((en) => en.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  let data = request.body;
  data.id = Math.floor(Math.random() * 100);
  let exists = entries.find(en => en.name === data.name)
  if (data.name && data.number) {
    if(exists){
      response.status(400).send({ error: "name must be unique" });
    }else{
      response.status(201).send(data);
    }
      
  }
  else { 
    response.status(400).send({ error: "name or number is missing" });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server Running on port 3001");
});
