const express = require("express")
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
const multer = require('multer')

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if ((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

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

router.post("/create", verifyUser, upload.single('projectImage'), (req, res, next) => {
  const githubId = req.body.githubId;
  const projectName = req.body.projectName;
  const description = req.body.description;
  const repositoryUrl = req.body.repositoryUrl;
  const deploymentUrl = req.body.deploymentUrl;
  const frameworks = req.body.frameworks;
  const imageUrl = req.file.filename;

  const projectData = {
    githubId,
    projectName,
    description,
    repositoryUrl,
    deploymentUrl,
    frameworks,
    imageUrl
  }

  const project = new Project(projectData)

  project.save()
          .then(() => res.json(project))
          .catch(err => res.status(400).json('Error: ' + err))
})

router.put("/update/:id", verifyUser, (req, res, next) => {
  let myquery = { _id: ObjectId(req.params.id) };
  Project.findOne(myquery, function (err, result) {
    if (err) {
      res.statusCode = 500
      res.send(err)
    } else {
      let newValues = {
        $set: {
          projectName: req.body.projectName,
          description: req.body.description,
          repositoryUrl: req.body.repositoryUrl,
          imageUrl: req.body.imageUrl
        },
      };
      Project.updateOne(myquery, newValues, function (err, result) {
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