const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override"); //to handle delete request
//core node js modules
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");

require("dotenv").config();

const app = express();

//we will not create schemas or modulas or anything , we are using gridfs stream to handle that  i.e to handle crud operations

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride("_method"));

//DB connection

const mongoURI = process.env.DB_CONNECT;

// process.env.DB_HOST

//throws error conn.once is not a function
/*
let gfs ;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex: true
}).then((conn) => {
    console.log("DB CONNECTED" );
    conn.once('open',  () => {
         gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads') //creating collection
      })
});
*/

const conn = mongoose.createConnection(mongoURI); //to handle multiple connections

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

//creating storage engine , (multer-gridfs-storage)
//copy from github doc -> using this so we can give a different name to an uploaded file  with extension
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      //crypto.randomBytes -> used to generate names
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);

        //bucketNAme should match the collection name
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

//for uploading file
// upload.single('file') for uploading a single file as with multer we can upload multiple files
// upload.single('file) here file is the name of the input field
app.post("/upload", upload.single("file"), (req, res) => {
  // console.log("Req", req.file);
  res.send({ file: req.file });
});

//Upload Multiple files
app.post("/multiple", upload.array("file", 4), (req, res) => {
  console.log(req.file);
  res.send("Multiple files uploaded");
});

//get all files
/*
All file meta-data (file name, upload date, contentType, etc) are stored in a special 
mongodb collection separate from the actual file data. This collection can be queried directly

we can access it as we access mongoose modal
*/

//make this for single image
app.get("/images/:filename", (req, res) => {
  // console.log("IMAGES Api Called");
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      res.status(404).send("No file exits");
    } else {
      //Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }

    // if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
    //Read output to browser
    // const readstream = gfs.createReadStream(file.filename);
    // readstream.pipe(res);
    // } else {
    // res.status(404).send("Not An Image");
    // }
  });
});

app.get("/allImages", async (req, res) => {
  console.log("All Images Api Called", req.query.type);

  if (req.query.type == "Video") {
    gfs.files
      .find({
        contentType: {
          $in: [
            "video/mp4",
            "video/mpeg",
            "video/ogg	",
            "video/quicktime",
            "video/webm",
            "video/ms-asf",
            "video/x-msvideo",
          ],
        },
      })
      .toArray((err, files) => {
        if (!files || files.length == 0) {
          res.status(404).send("No files exits");
        } else {
          for (let i = 0; i < files.length; i++) {
            files[i].displayName = `/images/${files[i].filename}`;
            // console.log(files[i]);
          }
          res.send(files);
        }
      });
  } else if (req.query.type == "Images") {
    gfs.files
      .find({
        contentType: {
          $in: [
            "image/jpeg",
            "image/jpg",
            "image/svg",
            "image/gif",
            "image/png",
            "image/webp",
          ],
        },
      })
      .toArray((err, files) => {
        if (!files || files.length == 0) {
          res.status(404).send("No files exits");
        } else {
          for (let i = 0; i < files.length; i++) {
            files[i].displayName = `/images/${files[i].filename}`;
            // console.log(files[i]);
          }
          res.send(files);
        }
      });
  } else if (req.query.type == "Files") {
    gfs.files
      .find({
        contentType: {
          $in: ["text/css", "text/javascript", "text/plain"],
        },
      })
      .toArray((err, files) => {
        if (!files || files.length == 0) {
          res.status(404).send("No files exits");
        } else {
          for (let i = 0; i < files.length; i++) {
            files[i].displayName = `/images/${files[i].filename}`;
            // console.log(files[i]);
          }
          res.send(files);
        }
      });
  } else if (req.query.type == "PDF") {
    gfs.files
      .find({
        contentType: "application/pdf",
      })
      .toArray((err, files) => {
        if (!files || files.length == 0) {
          res.status(404).send("No files exits");
        } else {
          for (let i = 0; i < files.length; i++) {
            files[i].displayName = `/images/${files[i].filename}`;
            // console.log(files[i]);
          }
          res.send(files);
        }
      });
  } else if (req.query.type == "Songs") {
    gfs.files
      .find({
        contentType: {
          $in: ["audio/mpeg", "audio/mp4", "audio/vnd.wav", "audio/basic"],
        },
      })
      .toArray((err, files) => {
        if (!files || files.length == 0) {
          res.status(404).send("No files exits");
        } else {
          for (let i = 0; i < files.length; i++) {
            files[i].displayName = `/images/${files[i].filename}`;
            // console.log(files[i]);
          }
          res.send(files);
        }
      });
  }
});

app.delete("/deleteFile/:id", (req, res) => {
  // we also have to write collection name in root

  // console.log("Body", req.body);

  if (req.body.key == "viscaelbarca") {
    // console.log("Correct password");
    gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
      if (err) return res.status(404).send(err);

      res.send("File Successfully Deleted");
    });
  } else {
    res.status(404).send("Please Enter Correct Password");
  }
});

app.listen(8080, () => console.log("Server started at 8080....."));
