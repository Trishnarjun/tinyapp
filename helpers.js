const bcrypt = require('bcryptjs');
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
const urlByEmail = (urlDatabase, foundUser) => {
  let userUrlDatabase = [];
  for (const key in urlDatabase) {
    if (urlDatabase[key]["userID"] === foundUser.id) {
      userUrlDatabase[key] = {
        longURL: urlDatabase[key]["longURL"],
        userID: urlDatabase[key]["userID"]
      }
    }
  }
  return userUrlDatabase;
}

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
const checkPassword = (foundUserPass, password) => {
  console.log(foundUserPass, password)
  if (password === "" ) {
      return false;
    }
    return bcrypt.compareSync(password, foundUserPass)
} 

module.exports = { urlByEmail, checkEmail, checkUser, checkPassword,generateRandomString }