require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(express.json());
const users = [];

app.get("/users", authenticateToken, (req, res) => {
  res.json(users.filter((user) => user.username === req.body.name));
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const user = { name: req.body.name, title: req.body.title };
    users.push(user);
    res.status().send();
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  const username = req.body.name;
  const user = users.find((user) => (user.name = username));
  if (user == null) {
    return res.status(400).send("You are not allowed to visit this page"); //res.status(400).send('You are not authorized')
  } else {
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({ accessToken: accessToken });
  }
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.splite("")[1];
  if (token == null) {
    return res.status(400).send();
    jwt.verify(token, process.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send();
        res.user = user;
        next();
      }
    });
  }
}
app.listen(5000, () => {
  console.log("running ....");
});
