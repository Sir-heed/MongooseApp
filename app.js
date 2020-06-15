const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import Schema
const Book = require("./Book.model");

// Create app and port
const app = express();
const port = 8080;

// Connect database
const db = "mongodb://localhost:27017/MongooseApp";
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo DB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

// Body parser middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Happy to be here");
});

// Get all books
app.get("/books", (req, res) => {
  console.log("getting all books");
  Book.find({}, (err, result) => {
    if (err) {
      res.send("error has occured");
    } else {
      res.json(result);
    }
  });
});

// Get one book
app.get("/books/:bookId", (req, res) => {
  console.log("Getting one book");
  Book.findOne(
    {
      _id: req.params.bookId,
    },
    (err, result) => {
      if (err) {
        res.send("error occured");
      } else {
        res.json(result);
      }
    }
  );
});

// Create book
app.post("/books", (req, res) => {
  console.log("here");
  const newBook = new Book();
  newBook.title = req.body.title;
  newBook.author = req.body.author;
  newBook.category = req.body.category;
  newBook.save((err, result) => {
    if (err) {
      res.send("Error saving book");
    } else {
      console.log("Saving book");
      res.send(result);
    }
  });
});

// Another way to create book
// app.post("/books", (req, res) => {
//   Book.create(req.body, (err, result) => {
//     if (err) {
//       res.send("Error saving book");
//     } else {
//       console.log("Saving book");
//       res.send(result);
//     }
//   });
// });

// Update a book
app.put("/book/:bookId", (req, res) => {
  console.log("here");
  Book.findOneAndUpdate(
    {
      _id: req.params.bookId,
    },
    {
      $set: {
        title: req.body.title,
      },
    },
    { upsert: true, new: true, useFindAndModify: false },
    (err, result) => {
      if (err) {
        res.send("Error occured while updating");
      } else {
        console.log("Updating book");
        res.status(result);
      }
    }
  );
});

// Delete a book
app.delete("/book/:bookId", (req, res) => {
  Book.findOneAndRemove(
    {
      _id: req.params.bookId,
    },
    { useFindAndModify: false },
    (err, result) => {
      if (err) {
        res.send("Error while deleting");
      } else {
        console.log("Deleting book");
        res.send(result);
      }
    }
  );
});

//   Start server
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
