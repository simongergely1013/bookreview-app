const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get all the book available in the shop
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    const allBooks = {...books};
    resolve(allBooks)
  })
  getBooks.then(data => {
    res.send(data);
  }).catch((err) => {
    res.send(err)
  }) 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
const isbn = parseInt(req.params.isbn);
const getBooksByIsbn = new Promise((resolve, reject) => {
  let booksArray = Object.values(books);
  let filteredBooks = booksArray.filter(book => book.ISBN === isbn);
  if(filteredBooks.length > 0){
    resolve(filteredBooks)
  } else {
    return res.status(404).json({message: "Book not found"});
  }
})

getBooksByIsbn.then(data => {
  res.send(data);
}).catch((err) => {
  res.send(err);
})
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const booksArray = Object.values(books);
    const filteredBooks = booksArray.filter(book => book.author === author);
    if(filteredBooks.length > 0){
      resolve(filteredBooks)
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  })

getBooksByAuthor.then(data => {
  res.send(data)
}).catch(err => {
  res.send(err)
})  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    const booksArray = Object.values(books);
    const filteredBooks = booksArray.filter(book => book.title === title);
    if(filteredBooks.length > 0){
      resolve(filteredBooks)
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  })

getBooksByTitle.then(data => {
  res.send(data)
}).catch(err => {
  res.send(err)
})  
});

//  Get book review based on ISBN
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const getBookReviewByIsbn = new Promise((resolve, reject) => {
    const booksArray = Object.values(books);
    const filteredBooks = booksArray.filter(book => book.ISBN === isbn);
    if(filteredBooks.length > 0){
      resolve(filteredBooks[0].reviews)
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  })

getBookReviewByIsbn.then(data => {
  res.send(data)
}).catch(err => {
  res.send(err)
})  
});

module.exports.general = public_users;
