const express = require("express")
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


const {
    getToken,
    COOKIE_OPTIONS,
    getRefreshToken,
    verifyUser,
} = require("../authenticate")

const jwt = require("jsonwebtoken")

const Project = require("../models/Project");

// This section will help you get a list of all the projects.
router.get("/all", (req, res, next) => {
  Project.find({}, function (err, results) {
    if (err) {
      res.statusCode = 500
      res.send(err)
    } else {
      res.json(results);
    }
  });
});


router.get("/:id", (req, res, next) => {
  let myquery = { _id: ObjectId(req.params.id) };
  Project.findOne(myquery, function (err, result) {
    if (err) {
      res.statusCode = 500
      res.send(err)
    } else {
      res.json(result);
    }
  });
});

router.post("/create", verifyUser, (req, res, next) => {
  const project = Project.create({
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
  });

  res.status(200)
  res.json(project);
})

router.put("/update/:id", verifyUser, (req, res, next) => {
  let myquery = { _id: ObjectId(req.params.id) };
  Project.findOne(myquery, function (err, result) {
    if (err) {
      res.statusCode = 500
      res.send(err)
    } else {
      let newvalues = {
        $set: {
          name: req.body.name,
          position: req.body.position,
          level: req.body.level,
        },
      };
      Project.updateOne(myquery, newvalues, function (err, result) {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          console.log("1 document updated");
          res.json(result);
        }

      });
    }
  });
})


// This section will help you delete a record
router.delete("/delete/:id", verifyUser, (req, res, next) => {
  let myquery = { _id: ObjectId(req.params.id) };
  Project.findOne(myquery, function (err, result) {
    if (err) {
      res.statusCode = 500
      res.send(err)
    } else {
      Project.deleteOne(myquery, function (err, result) {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          console.log("1 document deleted");
          res.json(result);
        }
      });
    }
  });
})

module.exports = router