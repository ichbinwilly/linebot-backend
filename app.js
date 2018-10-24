const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphb = require('express-handlebars');
const redis = require('redis');
const config = require('./config');
//create Redis Client
const client = redis.createClient(config.getRedisUrl());

client.on('connect', () => {
  console.log('Connected to Redis....');  
});

//set port
const port = 3000;

//init app
const app = express();
// view engine
app.engine('handlebars', exphb({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//methodOverride
app.use(methodOverride('_method'));

// search page
app.get('/', (req, res, next) => {
  profiles =[];
  //getAllProfiles();
  client.keys('*', function (err, keys) {
    if (err) return console.log(err);
    console.log('profiles: ' + keys.length);
    console.log('profiles: ' + keys);
    res.render('searchusers', {
      profiles: keys
    });
  });
  
  
});

// search processing
app.get('/user/search', (req, res, next) => {
  let id = req.query.userId;
	console.log('id:' + id);
  client.hgetall(id, (err, obj) => {
    if (!obj) {
      res.render('searchusers', {
        error: 'User does not exist'
      });
    } else {
      obj.userId = id;
      console.log(obj);
      res.render('details', {
        user: obj
      })
    }
  });

});

// add userpage
app.get('/user/add', (req, res, next) => {
  res.render('adduser');
});

// add user
app.post('/user/add', (req, res, next) => {
  let id = req.body.userId;
  let displayName = req.body.displayName;
  let userId = req.body.userId;
  let pictureUrl = req.body.pictureUrl;
  let statusMessage = req.body.statusMessage;
  //set redis key value pair
  client.hmset(id, [
    'displayName', displayName,
    'userId', userId,
    'pictureUrl', pictureUrl,
    'statusMessage', statusMessage
  ], (err, reply) => {
    if (err) {
      console.log(err);
    } else {
      console.log(reply);
      res.redirect('/');
    }
  });
});

// add user
app.post('/user/send', (req, res, next) => {
  var to = req.body.to;
  var message = req.body.message;
  var request = require('request');
  
  var options = {
    url: 'https://api.line.me/v2/bot/message/push',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.getLineBotAccessToken(),
    },
    method: "POST",
    //json: true,   // <--Very important!!!
    body: JSON.stringify({
      "to": to,
      "messages": [{
          "type": "text",
          "text": message
        }
      ]
    })
  };

  request.post(options, function(error, response, body){
    res.redirect('/');
  });
});

//Delete user
app.delete('/user/delete/:id', (req, res, next) => {
  client.del(req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log('Server started on port :' + port);
  //flush db
  /*
  client.flushdb( function (err, succeeded) {
    console.log('flushdb' + succeeded); // will be true if successfull
  });
  */


  function callback(error, response, body) {
    console.log(error);
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info.stargazers_count + " Stars");
      console.log(info.forks_count + " Forks");
    }
  }
});
var profiles = [];
function getAllProfiles() {
  /**list all key, and get objects**/
   return profiles;
  /**list all key, and get objects**/
}