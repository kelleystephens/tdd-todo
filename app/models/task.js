'use strict';

var tasks = global.nss.db.collection('tasks');
var Mongo = require('mongodb');
// var _ = require('lodash');

class Task{
  static create(userId, obj, fn){
    if(typeof userId === 'string'){userId = Mongo.ObjectID(userId);}

    var task = new Task();
    task.userId = userId;
    task.title = obj.title;
    task.due = new Date(obj.due);
    task.color = obj.color;
    task.isComplete = false;
    tasks.save(task, (e,t)=>fn(t));
    fn();
  }
}

module.exports = Task;
