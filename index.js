const loadMessages = require('./load_messages');
const channelManager = require('./channel-manager');
//create Redis Client
var userId = '1234567';
var fieldId = 'subscribe_channels';
var addItemaddItem = 587;
var removeItem = 601;
//fake data injection  
//client.hset(userId, fieldId, "", ()=>
//{
//  console.log('Done');    
//});

/** Add Channel **/
channelManager.hgetAsync(userId, fieldId)
  .then((res, err) => channelManager.add(res, err, addItemaddItem))
  .then(function (res) {
    console.log('res: ' + res);
    channelManager.save(userId, fieldId, res);
  })
  .catch((error) => {
    console.log('something wrong: ' + error);
  })
function display(arr){
  console.log('i am farrari: ' + arr);
}
channelManager.listall(userId, fieldId, display);
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