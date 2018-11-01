require('dotenv').config();
const redis = require('redis');
const util = require('util');
require('util.promisify').shim();
//create Redis Client

console.log(process.env.REDIS_TEST_URL);
//const client = redis.createClient(process.env.REDIS_TEST_URL);
const client = redis.createClient(6379, '127.0.0.1', {});

function test() {
  return getAsync('foo').then(function (res) {
    console.log(res); // => 'bar'
  });
}
client.on('error', (error) => {
  console.log(error);
});



var userId = '1234567';
var fieldId = 'subscribe_channels';
const hgetAsync = util.promisify(client.hget).bind(client);
const hsetAsync = util.promisify(client.hset).bind(client);
var addItemaddItem = 586;
var removeItem = 601;
client.on('connect', () => {
  //client.hget(userId, fieldId, function (err, reply) {
  //  if (err) throw (err);
  //  console.log(reply);
  //})
  console.log('Connected to Redis....');

  //fake data injection
  
  client.hset(userId, fieldId, "", ()=>
  {
    console.log('Done');    
  });
  
  
  /** Add Channel **/  
  hgetAsync(userId, fieldId)
    .then((res, err) => add(res, err, 502))
    .then(function (res) {
      console.log(res);
      save(userId, fieldId, res);
    })
    .catch((error) => {
      console.log('something wrong: ' + error);
    })
  
  /** Remove Channel **/
  /*
  hgetAsync(userId, fieldId)
    .then(remove)
    .then(function (res) {
      console.log(res);
      save(userId, fieldId, res);
    })
    .catch((error) => {
      console.log('something wrong: ' + error);
    })  
    */
});


var add = function (res, err, additem) {
  var testItem = additem;
  return new Promise(function (resolve, reject) {
    var jsonedObj = GenJsonObj(res);
    var isFoundItem = IsFoundItem(jsonedObj, testItem)
    if(isFoundItem)
    {
      var arr = AddItem(jsonedObj, testItem)
      resolve(arr)
    }
    else{
      const reason = new Error('Item existed in the arrary')
      reject(reason)
    }    
  })
}

var remove = function (res, err) {
  return new Promise(function (resolve, reject) {

    var jsonedObj = GenJsonObj(res);
    var arr = RemoveItem(jsonedObj, removeItem);
    resolve(arr)
  })
}

var save = function (userId, fieldId, obj) {
  hsetAsync(userId, fieldId, ToJsonString(obj.sort())).then(function (res, err) {
  //client.hset(userId, fieldId, ToJsonString(obj), function () {
    var result = hgetAsync(userId, fieldId).then(function (res, err) {
      console.log("result: " + res); // => 'bar'
      return res;
    })
  });
}

function ToJsonString(obj) {
  return JSON.stringify(obj);
}

function GenJsonObj(str) {
  try
  {
    JSON.parse(str);
  }
  catch(err)
  {
    console.log('invalid json str, create empty');
    return GenEmptyArrary();
  }
  return JSON.parse(str);
}

function GenEmptyArrary(){
  return JSON.parse("[]");
}

function IsFoundItem(arr, item) {
  var isFound = arr.find(o => o === item);
  if (isFound === undefined) {
    return true
  }
  return false;
}

function AddItem(arr, item) {
  var isFound = arr.find(o => o === item);
  if (isFound === undefined) {
    arr.push(item);
  }
  return arr;
}

function RemoveItem(arr, item) {
  var position = arr.indexOf(item);
  if (position > -1) {
    arr.splice(position, 1);
  }
  return arr;
}