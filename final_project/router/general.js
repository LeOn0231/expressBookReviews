const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Task 10: Get book list using async-await
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };

    const data = await getBooks();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book list." });
  }
});

// Task 11: Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found for the given ISBN.");
      }
    });
  };

  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 12: Get book details based on Author using async-await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found for the given author.");
      }
    });
  };

  try {
    const data = await getBooksByAuthor(author);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 13: Get book details based on Title using async-await
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found for the given title.");
      }
    });
  };

  try {
    const data = await getBooksByTitle(title);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for the given ISBN." });
  }
});

module.exports.general = public_users;
