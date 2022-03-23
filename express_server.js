const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const { set } = require("express/lib/application");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

function generateRandomString() {
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

generateRandomString();


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key] = req.body.longURL;  // Log the POST request body to the console
  res.redirect(`/urls/${key}`);// Respond with 'Ok' (we will replace this)
});
app.post("/urls/:shortURL/delete", (req, res) => {
  let databasekey = req.params.shortURL;
  delete urlDatabase[databasekey];
  res.redirect(`/urls`);// Respond with 'Ok' (we will replace this)
});
app.post("/urls/:id", (req, res) => {
  const dataBaseKey = req.params.id;
  urlDatabase[dataBaseKey] = req.body.longURL;
  res.redirect(`/urls/${req.params.id}`);
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  console.log(username);
  res.cookie("username", username);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect(`/urls`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});



app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});