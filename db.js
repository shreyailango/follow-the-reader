const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//const dbUrl = "mongodb://localhost/user";
const dbUrl = "mongodb+srv://silango:0xs2dS6FaQoq5ndS@cluster0.h9g9gjy.mongodb.net/test"
const connect = async () => {
 mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
 const db = mongoose.connection;
 db.on("error", () => {
 console.log("could not connect");
 });
 db.once("open", () => {
 console.log("> Successfully connected to database");
 });
};
module.exports = { connect };