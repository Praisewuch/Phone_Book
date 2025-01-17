const express = require('express')
const app = express()
var morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('dist'))

app.use(express.json())
morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then( data => {
    response.json(data)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  let now = `${date.toDateString()} ${date.toTimeString()}`
  const people = Person.length
  response.send(
    `<p>Phonebook has info for ${people} people<p/>
     <p>${now}</p>`
  )
})

app.get('/api/persons/:id', (request, response,next) => {
  const id = request.params.id

  Person.findById(id).then( data => {
    if(data){
      response.json(data)
    }else{
      response.status(404).end()
    }
  }).catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response,next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    console.log(result + 'Deleted!!')
    response.status(204).end()
  }).catch(err => next(err))
})

app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = {
    number:request.body.number
  }
  Person.findByIdAndUpdate(id, person, { new:true }).then(data => {
    response.status(204).end()
    console.log(data + 'updated!!')
  })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const persons = new Person({
    name:name,
    number:number
  })
  if (name && number) {
    persons.save().then(result => {
      response.status(201).send(result)
    }).catch(err => next(err))
  }else {
    response.status(400).send({ error: 'name or number is missing' })
  }
})

const errorHandler = (err,request, response, next) => {
  console.log(err)

  if(err.name === 'CastError'){
    return response.status(400).send({ error: 'person not found!' })
  }else if(err.name === 'ValidationError'){
    return response.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server Running on port 3001')
})
