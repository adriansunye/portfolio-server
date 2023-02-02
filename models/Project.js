const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Project = new Schema({
  name: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  level: {
    type: String,
    default: "",
  },
})

//Remove refreshToken from the response
Project.set("toJSON", {
  transform: function (doc, ret, options) {
    return ret
  },
})

module.exports = mongoose.model("Project", Project)

