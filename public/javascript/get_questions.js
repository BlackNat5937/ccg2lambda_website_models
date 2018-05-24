//OBSOLETE

const mysql = require('mysql');
const config = require(`./config.json`);

var con = mysql.createConnection({
    host : config.mysql_host,
    user: config.mysql_username,
    password: config.mysql_password, 
    database:"visualization"
});

con.connect(function(err){
    if(err) throw err;
    con.query("SELECT * FROM questions",function(err,result,fields){
        if(err) throw err;
        console.log(result);
    });
});