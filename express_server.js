const cookieSession = require('cookie-session');
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['1218'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// Creat random ID for each URL or users

function generateRandomString() {
  return Math.random().toString(36).substring(7);
};


// Main URL database for all URLs created by users

var urlDatabase = {};


// Main user database

var users = {};


// Helper Functions

function checkCredentials(req) { // Check whether input username or password is empty
  if (!req.body.email || !req.body.password) {
    return true;
  } else {
    return false;
  }
};

function getUserByEmail(email) { // iterate through users and check whether email already exists
  let foundUser = false;
  
  for (user in users) {
    if (users[user].email === email) {
      foundUser = users[user];
    }
  }
  return foundUser;
};


// Login

app.get("/login", (req, res) => {
  res.render("urls_login");
});

app.post("/login", (req, res) => {
  let user = getUserByEmail(req.body.email);
  if (checkCredentials(req)) {
    res.status(400).send('Email address and password field cannot be empty!');
  }
  if (!user) {
    res.status(403).send("You are not resgister yet! Please register your account and log in again!");
  } 

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    } else {
      res.status(403).send('Invalid password!');
    }
  } 
});


// Register

app.get("/register", (req, res) =>{
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  if (checkCredentials(req)) {
    res.status(400).send('Email address and password field cannot be empty!');
  };

  const emailInput = req.body.email;

  if (getUserByEmail(emailInput)) {
    res.status(400).send('This email address has already been resgistered!');
  };

  const randomId = generateRandomString();

  let user = {
    id: randomId,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }

  users[randomId] = user;
  req.session.user_id = user.id;
  res.redirect("/urls");
});


// Logout

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


// Main /urls Page

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const User = users[userId];
  let templateVars = { 
    urls: urlDatabase,
    user: User
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  const User = users[userId];

  if (userId) {
    const key = generateRandomString();
    let urlInfo = {
      longURL: req.body.longURL,
      userID: User.id
    };
    urlDatabase[key] = urlInfo; 
    res.redirect("/urls/" + key); 
  }
});


// Create New URLs

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const User = users[userId];
  
  if (userId) {
    let templateVars = {
      user: User
    }
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});


// Dealing with the new or existed URLs

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const User = users[userId];

  if (!userId) {
    res.send("You need to login before accessing this TinyURL.");
  } else {
    if (userId !== urlDatabase[req.params.shortURL].userID) {
      res.send("Oops! This TinyURL is not belonged to you!");
    } else {
      let templateVars = { 
        shortURL: req.params.shortURL, 
        longURL: urlDatabase[req.params.shortURL].longURL,
        user: User
      };
      res.render("urls_show", templateVars);
    }
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let keys = req.params.shortURL;
  delete urlDatabase[keys];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  let shortUrl = req.params.id;
  let longUrl = req.body.longURL;
  urlDatabase[shortUrl].longURL = longUrl;
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


// Other routes 

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/", (req, res) => {
  const userId = req.session.user_id;

  if (userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

