const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url).then(() => {
  console.log('connected! to Database')
}).catch(err => {
  if(err)console.log('Error: '+ err)
})


const personSchema = new mongoose.Schema({
  name:{
    type:String,
    minLength: 3,
    required: true
  },
  number:{
    type:String,
    minLength: 8,
    validate:{
      validator: function(v){
        return /\d{3}-\d{8}/.test(v) || /\d{2}-\d{7}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Person', personSchema)


