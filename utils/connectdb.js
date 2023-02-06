const mongoose = require("mongoose")
const url = 'mongodb+srv://admin:C5RR5jvoQNEWHOgK@cluster0.dqogarz.mongodb.net/portfolio'
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
connect
  .then(db => {
    console.log("Successfully connected to MongoDB.")
  })
  .catch(err => {
    console.log(err)
  })