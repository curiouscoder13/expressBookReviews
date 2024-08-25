const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios").default;
const baseURL = "http://localhost:5000";

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   return res.send(JSON.stringify(books, null, 4));
// });

// Creating a new public route for books
public_users.get("/books", (req, res) => {
  res.json(books);
});

// Get book list using axios
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/books`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching the books:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (!book) {
//     return res.status(404).send({ message: "Book not found" });
//   }
//   return res.send(JSON.stringify(book, null, 4));
// });

// Get book details based on ISBN using axios
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${baseURL}/books`);
    const bookList = response.data;
    const book = bookList[isbn];
    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching the book:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author;
//   let bookKeys = Object.keys(books);
//   // convert bookKeys values to int
//   bookKeys = bookKeys.map(Number);
//   bookKeys.forEach((key) => {
//     const book = books[key];
//     if (book.author === author) {
//       return res.send(JSON.stringify(book, null, 4));
//     }
//   });
// });

// Get book details based on author using axios
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`${baseURL}/books`);
    const bookList = response.data;
    let bookKeys = Object.keys(books);
    // convert bookKeys values to int
    bookKeys = bookKeys.map(Number);
    bookKeys.forEach((key) => {
      const book = books[key];
      if (book.author === author) {
        return res.status(200).send(JSON.stringify(book, null, 4));
      }
    });
  } catch (error) {
    console.error("Error fetching the books:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
//   let bookKeys = Object.keys(books);
//   // convert bookKeys values to int
//   bookKeys = bookKeys.map(Number);
//   bookKeys.forEach((key) => {
//     const book = books[key];
//     if (book.title === title) {
//       return res.send(JSON.stringify(book, null, 4));
//     }
//   });
// });

// Get all books based on title using axios

public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`${baseURL}/books`);
    const bookList = response.data;
    let bookKeys = Object.keys(books);
    // convert bookKeys values to int
    bookKeys = bookKeys.map(Number);
    bookKeys.forEach((key) => {
      const book = books[key];
      if (book.title === title) {
        return res.status(200).send(JSON.stringify(book, null, 4));
      }
    });
  } catch (error) {
    console.error("Error fetching the books:", error);
    res.status(500).send("Internal Server Error");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }
  return res.send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
