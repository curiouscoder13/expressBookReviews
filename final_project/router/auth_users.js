const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username && /^[a-zA-Z0-9]+$/.test(username);
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "Invalid username" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authenticated = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authenticated.username;
  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }
  if (!review) {
    return res.status(404).json({ message: "Review cannot be empty" });
  }

  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  let bookUserReview = {
    [username]: review,
  };
  Object.assign(book.reviews, bookUserReview);
  return res.status(200).json(book);
});

// Delete a book review of a user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authenticated.username;
  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "User has not reviewed this book" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
