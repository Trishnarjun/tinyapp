const bcrypt = require('bcryptjs');
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
  if (password === "" ) {
      return false;
    }
    return bcrypt.compareSync(password, foundUserPass)
} 

module.exports = { urlByEmail, checkEmail, checkUser, checkPassword }