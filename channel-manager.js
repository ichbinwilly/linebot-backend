require('dotenv').config();
require('util.promisify').shim();
const redis = require('redis');
const util = require('util');
const client = redis.createClient(6379, process.env.REDIS_TEST_URL, {});

const hgetAsync = util.promisify(client.hget).bind(client);
const hsetAsync = util.promisify(client.hset).bind(client);

module.exports = {
    hgetAsync: hgetAsync,
    save: save,
    add: add,
    listall: listall
};

client.on('connect', () => {
    console.log('Connected to Redis....');
});
client.on('error', (error) => {
    console.log(error);
});
/**
 * add a new item to array
 */
function add(res, err, additem) {
    var testItem = additem;
    return new Promise(function (resolve, reject) {
        var jsonedObj = GenJsonObj(res);
        var isFoundItem = IsFoundItem(jsonedObj, testItem)
        if (isFoundItem) {
            var arr = AddItem(jsonedObj, testItem)
            resolve(arr)
        } else {
            const reason = new Error('Item existed in the arrary')
            reject(reason)
        }
    })
}

function remove(res, err) {
    return new Promise(function (resolve, reject) {

        var jsonedObj = GenJsonObj(res);
        var arr = RemoveItem(jsonedObj, removeItem);
        resolve(arr)
    })
}

function save(userId, fieldId, obj) {
    hsetAsync(userId, fieldId, ToJsonString(obj.sort())).then(function (res, err) {
        //client.hset(userId, fieldId, ToJsonString(obj), function () {
        var result = hgetAsync(userId, fieldId).then(function (res, err) {
            console.log("result: " + res);
            return res;
        })
    });
}

function listall(userId, fieldId, callback){
        //client.hset(userId, fieldId, ToJsonString(obj), function () {
    var result = hgetAsync(userId, fieldId).then(function (res, err) {
        //console.log("list all result: " + res);
        callback(res);
        return res;
    })
}

function ToJsonString(obj) {
    return JSON.stringify(obj);
}

function GenJsonObj(str) {
    try {
        JSON.parse(str);
    } catch (err) {
        console.log('invalid json str, create empty');
        return GenEmptyArrary();
    }
    return JSON.parse(str);
}

function GenEmptyArrary() {
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