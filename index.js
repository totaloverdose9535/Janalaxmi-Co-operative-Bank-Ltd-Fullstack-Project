var express = require("express");
var app = express();

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

var upload = require("express-fileupload");
app.use(upload());
app.use(express.static("public/"));

var session = require("express-session");
app.use(session({
    secret: "1234554321",
    saveUninitialized: true,
    resave: true
}));

var user_route = require("./routes/user_route");
var admin_route = require("./routes/admin_route");

app.use("/", user_route);
app.use("/admin", admin_route);


app.listen(1000);