const express = require("express");
const bodyParser = require("body-parser");
const { set } = require("express/lib/application");
const req = require("express/lib/request");
const bcrypt = require('bcryptjs');
const res = require("express/lib/response");
const cookieSession = require("cookie-session");
const { urlByEmail, checkEmail, checkUser, checkPassword } = require("./helpers")
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const generateRandomString = () => {
  let ranString = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let letter of letters) {
    ranString += letters.charAt(Math.floor(Math.random() * letters.length));
    if (ranString.length === 6) {
      break;
    }
  };
  return ranString;
};

const urlDatabase = {
  "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userID: 'userRandomID'
  } ,
  "9sm5xK": {
        longURL: "http://www.google.com",
        userID: 'userRandomID'
  } 
};

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

// post requestes

//adding URL to database
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  const id = req.session.user_id;
  let email = checkEmail(users, id)
  if (email) {
    urlDatabase[key] = {
      longURL: req.body.longURL,
      userID: id
    }
  }
  res.redirect(`/urls/${key}`);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  let databasekey = req.params.shortURL;
  const id = req.session.user_id;
  const email = checkEmail(users , id)
  if (email) {
    delete urlDatabase[databasekey];
  }
  return res.redirect(`/urls`);// Respond with 'Ok' (we will replace this)
});
//editing URL
app.post("/urls/:id", (req, res) => {
  const ids = req.session.user_id;
  const email = checkEmail(users , ids);
  if (email) {
    const dataBaseKey = req.params.id;
    urlDatabase[dataBaseKey]["longURL"] = req.body.longURL;
    return res.redirect(`/urls/${req.params.id}`);
  }
  res.send("you don't have access")
  
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let passwordLogin = req.body.password
  const foundUser = checkUser(users, email);
  const foundPassword = checkPassword(foundUser["password"], passwordLogin);
  if (!foundUser) {
    return res.status(403).send("User does not exist");
  }

  if (!foundPassword) {
    return res.status(403).send("Password does not match");
  }

  //set cookie
  req.session.user_id = foundUser.id
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

app.post("/register", (req,res) => {
  const id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  const foundUser = checkUser(users, email);
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === "" || password === "" ) {
    return res.status(400).send("One of the feilds is empty");
  }
  if (foundUser) {
    return res.status(400).send("User already exists");
  }
  users[id] = {
      id,
    email,
    password:  hashedPassword
  }
  //set cookie
  req.session.user_id = users;
  res.redirect("/login");
});

// get requestes

app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/register", (req, res) => {
  const id = req.session.user_id;
  const templateVars = { user: req.session.user_id , email: null };
  res.render("register", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = { user: req.session.user_id , email: null };
  res.render("login", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  if (TypeError) {
    res.send("shortURL does not exist")
  }
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req,res) => {
  const id = req.session.user_id;
  const email = checkEmail(users , id);
  const foundUser = checkUser(users, email);
  const userUrlDatabase = urlByEmail(urlDatabase, foundUser);
  if (email) {
    const templateVars = { urls: userUrlDatabase, user: id , email};
    return res.render("urls_index", templateVars);
  }
  res.send("you need to login or register")
  
});
app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const email = checkEmail(users, id);
  const templateVars = { user: req.session.user_id , email};
  if (email) {
    return res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});
app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  const email = checkEmail(users , id);
  const foundUser = checkUser(users, email);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: req.session.user_id, email };
  if (email && email === foundUser.email) {
    return res.render("urls_show", templateVars);
  }
  res.send("you need to login or register");
})
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Listening port

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});