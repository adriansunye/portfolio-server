const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Project = new Schema({
  projectName: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  repositoryUrl: {
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

