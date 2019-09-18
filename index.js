var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var logger = require('morgan');
var routes = require('./routes/directs');
var app = express();
const port = process.env.PORT || 1338;

var db = (async function(){
    const url = "mongodb://localhost:27017/CodeTutorDB";
    const dbName = 'CodeTutorDB';
    const client = new MongoClient(url,{useNewUrlParser:true});
    try{
        await client.connect();
        console.log('connected to Mongo....');
        return client.db(dbName);
    }catch(err){
        console.log('unable to connect to mongo server...')
    }
})();

process.on('uncaughtException',function(err){
    console.log('Caught exception: '+err)
})

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://localhost%s:%s", host, port)
})

app.use(function(req,res,next){
    res.db = db;
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//app.use(compression({threshold:1}));

app.use('/api',routes);

app.use(function(err,req,res,next){
    console.log(err)
    //res.status(err.status || 500);
    res.send(err)
});

