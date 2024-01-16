console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");



// 1 Kirish code
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 2 Session code


// 3 Views code
app.set("views", "views");
app.set("view engine", "ejs");

//Routing code                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
app.use("/", router)
//app.use("/resto", router_bssr)

module.exports=app