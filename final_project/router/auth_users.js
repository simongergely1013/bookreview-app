const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "simon1",
    "password": "123456"
}
];

const isValid = (username)=>{   
  let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//get registered users list
regd_users.get("/", (req, res) => {
  res.send(users);
})

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  
} else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review based on ISBN
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = parseInt(req.params.isbn);
  let review = req.query.review;
  let {username} = req.session.authorization;
  
  if(req.session.authorization){
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.ISBN === isbn);
    if(filteredBooks.length > 0){
      let book = filteredBooks[0];
      book.reviews = {...book.reviews, [username]: review}
    } else {
      return res.status(404).json({message: "Book not found"});
    }
    res.status(200).send(`Review successfully added by ${username}`)
  } else {
    res.status(400).send("Log in or register to add review")
  }
});

// Delete book review based on ISBN
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = parseInt(req.params.isbn);
  let {username} = req.session.authorization;

  if(req.session.authorization){
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.ISBN === isbn);
    if(filteredBooks.length > 0){
      let book = filteredBooks[0];
      let {reviews} = book;
      delete reviews[username];
      book.reviews = reviews;
    } else {
      return res.status(404).json({message: "Book not found"});
    }
    res.status(200).send("Review successfully removed")
  } else {
    res.status(400).send("Log in or register to add review")
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
