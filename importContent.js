const fs = require('fs');
const mysql = require('mysql');

// import site config
const config = import('config.json');

// has to be 4 args
if (process.argv.length < 4)
    throw 'please use 3 arguments';

//TODO check args integrity

// putting parameters in variables
let sentence = process.argv.shift();
let jsonFilePath = process.argv.shift();
let graphImageFilePath = process.argv.shift();
let drsImageFilePath = process.argv.shift();

// connection to the database
let con = mysql.createConnection({
    host: config.mysql_host,
    user: config.mysql_username,
    password: config.mysql_password,
    database: "visualization",
});

// connect to the database throw the error if there is one
con.connect(function (err) {
    if (err) throw err;

    //TODO find something better than sending a query via string

    let sql = `INSERT INTO sentences(sentence_string) VALUES('${sentence}')`;

    // insert the thing
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`1 record inserted : "${sentence}"`);
    });
    console.log("Connected to mysql database.");
});