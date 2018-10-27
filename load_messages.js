const redis = require('redis');
const config = require('./config');
const client = redis.createClient(config.getRedisUrl());
client.on('connect', () => {
    console.log('Connected to Redis....');
});

function loadMessages(req, reply) {

    client.lrange('test', 0, -1, function (err, result) {
        console.log('result: ' + result);
        /*
        result.forEach(function (msg) {
            console.log(msg);
            
            var obj = JSON.parse(msg);
            if(obj.t !== undefined)
            {
                console.log(getTime(obj.t));
            }
            
        });
        */
        reply.send(result);
    });
};

function loadUserPhoto(req, reply, key){
    console.log('loadUserPhotoId: ' + req.query.userId);
    client.hgetall(req.query.userId, (err, obj) => {
        console.log(obj);
        reply.send(obj);
      });
}

module.exports = {
    load: loadMessages,
    loadUserPhoto: loadUserPhoto
};

function leadZero(number) {
    return (number < 10) ? '0' + number : number;
}

function getTime(timestamp) {
    var t, h, m, s;

    t = new Date(timestamp);
    h = leadZero(t.getHours());
    m = leadZero(t.getMinutes());
    s = leadZero(t.getSeconds());

    return String(h) + ':' + m + ':' + s;
}