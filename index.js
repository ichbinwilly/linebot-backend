const loadMessages = require('./load_messages');
const channelManager = require('./channel-manager');
//create Redis Client
var userId = 'fakeId';
var fieldId = 'subscribe_channels';
var addItemaddItem = 587;
var removeItem = 587;
//fake data injection  
//client.hset(userId, fieldId, "", ()=>
//{
//  console.log('Done');    
//});

/** Add Channel **/
/*
channelManager.hgetAsync(userId, fieldId)
  .then((res, err) => channelManager.add(res, err, addItemaddItem))
  .then(function (res) {
    console.log('res: ' + res);
    channelManager.save(userId, fieldId, res);
  })
  .catch((error) => {
    console.log('something wrong: ' + error);
  })

*/
function display(arr){
  console.log('i am farrari: ' + arr);
  console.log('i am farrari arr.length: ' + JSON.parse(arr).length);
  if(JSON.parse(arr).length > 2)
    console.log('amount is equal to or greater to 1');
  else
    console.log('less than 1');
}
//demo list all and callback fn
channelManager.listall(userId, fieldId, display);
/** Remove Channel **/
/*
channelManager.hgetAsync(userId, fieldId)
  .then((res, err) => channelManager.remove(res, err, removeItem))
  .then(function (res) {
    console.log(res);
    channelManager.save(userId, fieldId, res);
  })
  .catch((error) => {
    console.log('something wrong: ' + error);
  })
*/