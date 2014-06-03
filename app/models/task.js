'use strict';

var tasks = global.nss.db.collection('tasks');
var Mongo = require('mongodb');
var _ = require('lodash');

class Task {
  static create(userId, obj, fn){
    var task = new Task();
    task.title = obj.title;
    task.due = new Date(obj.due);
    task.color = obj.color;
    task.isComplete = false;
    task.userId = Mongo.ObjectID(userId);

    tasks.save(task, (e,t)=>{
      fn(t);
    });
  }

  static findById(id, fn){
    if(id.length !== 24){fn(null); return;}

    id = Mongo.ObjectID(id);
    tasks.findOne({_id:id}, (e,t)=>{
      if(t){
        t = _.create(Task.prototype, t);
        fn(t);
      }else{
        fn(null);
      }
    });
  }

  static findByUserId(userId, fn){
    if(userId.length !== 24){fn(null); return;}
    userId = Mongo.ObjectID(userId);

    tasks.find({userId:userId}).toArray((e, a)=>{
      fn(a);
    });
  }

  destroy(fn){
    tasks.findAndRemove({_id:this._id}, ()=>fn());
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
  }

  edit(obj){
    this.title = obj.title;
    this.due = new Date(obj.due);
    this.color = obj.color;
  }

  save(fn){
    tasks.save(this, ()=>fn());
  }

}

module.exports = Task;
