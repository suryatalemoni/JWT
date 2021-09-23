const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

const users = [];

app.get('/',(req,res)=>{
    res.render('index.ejs');
})

app.get("/users", (req, res) => {
  res.json(users);
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashPassword };
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
  const user = users.find((user) => (user.name == req.body.name));
  if (user == null) {
    return res.status(400).send("can not find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("success");
    } else {
      res.send("not allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(5000, () => {
  console.log("running ....");
});