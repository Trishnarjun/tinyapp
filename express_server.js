const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const { set } = require("express/lib/application");
const req = require("express/lib/request");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const checkEmail = (users, id) => {
    return (users[id]) ? users[id].email : null  
}

const checkUser = (users, email) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId]
    }
  }
  return false;
}
const checkPassword = (users, password) => {
  for (const userId in users) {
    if (users[userId].password === password) {
      return users[userId]
    }
  }
  return false;
} 

// post requestes

//adding URL to database
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  const id = req.cookies["user_id"];
  let email = checkEmail(users, id)
  let idVals = {};
  if (email) {
    console.log("okay");
    idVals["longURL"] = req.body.longURL;
    idVals["userID"] = id;
    urlDatabase[key] = idVals;
  }
    // Log the POST request body to the console
  console.log(urlDatabase);
  res.redirect(`/urls/${key}`);// Respond with 'Ok' (we will replace this)
});
app.post("/urls/:shortURL/delete", (req, res) => {
  let databasekey = req.params.shortURL;
  const id = req.cookies["user_id"];
  const email = checkEmail(users , id)
  if (email) {
    delete urlDatabase[databasekey];
  }
  
  return res.redirect(`/urls`);// Respond with 'Ok' (we will replace this)
});

//editing URL
app.post("/urls/:id", (req, res) => {
  const ids = req.cookies["user_id"];
  const email = checkEmail(users , ids);
  if (email) {
    const dataBaseKey = req.params.id;
    urlDatabase[dataBaseKey]["longURL"] = req.body.longURL;
    res.redirect(`/urls/${req.params.id}`);
  }
  res.redirect("/login")
  
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password
  const foundUser = checkUser(users, email);
  if (!foundUser) {
    return res.send("User does not exist");
  }
  const foundPassword = checkPassword(users, password);
  if (!foundPassword) {
    return res.send("Password does not match");
  }
  res.cookie("user_id" , foundUser.id);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/login`);
});

app.post("/register", (req,res) => {
  const id = generateRandomString();
  let user = {};
  let email = req.body.email;
  let password = req.body.password;

  if (email === "" || password === "" ) {
    return res.status(400).send("One of the feilds is empty");
  }
  const foundUser = checkUser(users, email);
  if (foundUser) {
    return res.send("User already exists");
  }
  user["id"] = id;
  user["email"] = email;
  user["password"] =  password;
  users[id] = user;
  console.log(users);
  res.cookie("user_id" , users);
  res.redirect("/urls");
});

// get requestes

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/register", (req, res) => {
  const id = req.cookies["user_id"];
  const email = checkEmail(users, id);
  const templateVars = { user: req.cookies["user_id"] , email: null };
  console.log(templateVars.user);
  res.render("register", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = { user: req.cookies["user_id"] , email: null };
  res.render("login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  const id = req.cookies["user_id"];
  console.log(users);
  console.log(id);
  const email = checkEmail(users , id);
  if (email) {
    const templateVars = { urls: urlDatabase, user: id , email};
     return res.render("urls_index", templateVars);
  }
  
  console.log(urlDatabase)
  console.log(email)
  res.send("you need to login or register")
  
});
app.get("/urls/new", (req, res) => {
  const id = req.cookies["user_id"];
  const email = checkEmail(users, id);
  const templateVars = { user: req.cookies["user_id"] , email};
  if (email) {
    return res.render("urls_new", templateVars);
  }
  res.send("you are not logged in");
  
});
app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies["user_id"];
  const email = checkEmail(users , id);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user: req.cookies["user_id"], email };
  if (email) {
    return res.render("urls_show", templateVars);
  }
  res.send("you need to login or register");
  
})






app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});