const express = require("express");
const bodyParser = require("body-parser");
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
  // Respond with 'Ok' (we will replace this)
});

// app.post("/urls/edit/:id", (req, res) => {
//   res.redirect(`/urls/${req.params.id}`);
//   // Respond with 'Ok' (we will replace this)
// });

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});



app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});