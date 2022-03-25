const { assert } = require('chai');

const { checkUser } = require('../helpers.js');


const testUsers = {
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

describe('checkUser', function() {
  it('should return a user with valid email', function() {
    const user = checkUser(testUsers, "user@example.com")
    const expectedUserID = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    };
    assert.deepEqual(user, expectedUserID);
  }),
  it('should return a user with valid email', function() {
    const user = checkUser(testUsers, "ser@example.com")
    const expectedUserID = false;
    assert.deepEqual(user, expectedUserID);
  });
});