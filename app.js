require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphb = require('express-handlebars');
const redis = require('redis');
const config = require('./config');
const loadMessages = require('./load_messages');
//create Redis Client
const client = redis.createClient(process.env.REDISCLOUD_URL);

client.on('connect', () => {
  console.log('Connected to Redis....');
});

//set port
const port = 3000;

//init app
const app = express();


/******Socket IO** */
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'test.html');
/****************** */
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

app.get('/client', (req, res, next) => {
  //res.sendFile('index.html');
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/test', (req, res, next) => {
  //res.sendFile('index.html');
  res.sendFile(path.join(__dirname + '/test.html'));
})
app.get('/load', loadMessages.load);

app.get('/getUserPhoto', (req, res, next) =>
  {
    loadMessages.loadUserPhoto(req, res, req.query.userId);
  }
);

app.get('/client.js', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/client.js'));
});

app.get('/style.css', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/style.css'));
});
// search page
app.get('/', (req, res, next) => {
  //var aa = client.rpop('test');
  //aa = client.rpop('test');
  //aa = client.rpop('test');
  //console.log('rpop ppppppppppp' + aa);
  
  //loadMessages();
 /*
  str = JSON.stringify({ // store each message as a JSON object
    m: 'test msg',
    t: new Date().getTime(),
    n: 'willy'
  });

  const result = client.rpush('test', str);
  */
  //console.log(result);

  profiles = [];
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
  console.log('send message to ' + to);
  console.log('send message message ' + message);
  var options = {
    url: 'https://api.line.me/v2/bot/message/push',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.CHANNEL_ACCESS_TOKEN,
    },
    method: "POST",
    //json: true,   // <--Very important!!!
    body: JSON.stringify({
      "to": to,
      "messages": [{
        "type": "text",
        "text": message
      }]
    })
  };

  request.post(options, function (error, response, body) {
    res.redirect('/client');
  });
});

//Delete user
app.delete('/user/delete/:id', (req, res, next) => {
  client.del(req.params.id);
  res.redirect('/');
});

/*
app.listen(port, () => {
  console.log('Server started on port :' + port);

  
   var chat =  [
  '{"m":"Hi everyone!","t":1436263590869,"n":"Steve"}',
    '{"m":"Hi Steve! Welcome to Hapi Chat!","t":1436263599489,"n":"Foxy"}',
    '{"m":"Hapi Chat lets you chat with your friends!","t":1436263613141,"n":"Oprah"}',
    '{"m":"Cool! How does it scale?","t":1436263620853,"n":"Steve"}',
    '{"m":"Funny you should ask! It scales nicely because it uses Hapi.js and Redis!","t":1436263639989,"n":"Chroma"}',
    '{"m":"Sweet! ","t":1436263645610,"n":"Steve"}',
    '{"m":"Hello","t":1436264664835,"n":"Timmy"}',
    '{"m":"Hi!","t":1436267152379,"n":"Timmy"}',
    '{"m":"lkjlkjlk","t":1436270948402,"n":"dd"}',
    '{"m":"Big fan of the little notifications at the top when a person joins","t":1436273109909,"n":"iteles"}'
]
  
  //flush db
  
  client.flushdb( function (err, succeeded) {
    console.log('flushdb' + succeeded); // will be true if successfull
  });
  


  function callback(error, response, body) {
    console.log(error);
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info.stargazers_count + " Stars");
      console.log(info.forks_count + " Forks");
    }
  }
});
*/
//const server = app.use((req, res) => res.sendFile(INDEX) ).listen(PORT, () => console.log(`Listening on ${ PORT }`));
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

//setInterval(() => io.emit('mytime', new Date().toTimeString()), 1000*5);
setInterval(() => io.emit('mytime', JSON.stringify({ // store each message as a JSON object
  m: 'test msg',
  t: new Date().getTime(),
  n: 'willy'
})), 1000*5);

var profiles = [];

function getAllProfiles() {
  /**list all key, and get objects**/
  return profiles;
  /**list all key, and get objects**/
}