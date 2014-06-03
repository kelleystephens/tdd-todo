/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'todo-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../app/app');
var request = require('supertest');
var traceur = require('traceur');
var moment = require('moment');

var Task;
var User;
var sue;
var task;
var task2;
var task3;

describe('Task', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      Task = traceur.require(__dirname + '/../../app/models/task.js');
      User = traceur.require(__dirname + '/../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      global.nss.db.collection('tasks').drop(function(){
        User.register({email:'sue@aol.com', password:'abcd'}, function(u){
          Task.create(u._id, {title: 'shop', due:'4/14/2014', color:'green'}, function(t){
            Task.create(u._id, {title: 'eat', due:'7/13/2014', color:'red'}, function(t2){
              Task.create('538dfb6e5dc8b9f1065585f2', {title: 'babysit', due:'8/24/2014', color:'yellow'}, function(t3){
                sue = u;
                task = t;
                task2 = t2;
                task3 = t3;
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('.create', function(){
    it('should create a task - string user id', function(done){ //simulating req.session (string)
      Task.create(sue._id.toString(), {title: 'Go shopping', due: '3/11/2014', color: 'green'}, function(t){
        expect(t).to.be.an.instanceof(Task);
        expect(t._id).to.be.ok;
        expect(t.title).to.equal('Go shopping');
        expect(t.due).to.be.an.instanceof(Date);
        expect(moment(t.due).format('MM/DD/YYYY')).to.equal('03/11/2014');
        expect(t.color).to.equal('green');
        expect(t.userId).to.deep.equal(sue._id);
        expect(t.userId).to.be.an.instanceof(Mongo.ObjectID);
        expect(t.isComplete).to.be.false;
      });
      done();
    });

    it('should create a task - object user id', function(done){ //simulating res.locals (the all fn in init routes)
      Task.create(sue._id, {title: 'salad', due:'4/14/2014', color:'green'}, function(t){
        expect(t).to.be.instanceof(Task);
        expect(t._id).to.be.ok;
      });
      done();
    });
  });

  describe('.findById', function(){
    it('should successfully find the task by its id', function(done){
      Task.findById(task._id.toString(), function(t){
        expect(t).to.be.instanceof(Task);
        expect(t._id).to.be.ok;
        expect(t._id).to.deep.equal(task._id);
      });
      done();
    });
    it('should NOT find the task - BAD ID', function(done){
      Task.findById('not an id', function(t){
        expect(t).to.be.null;
      });
      done();
    });

    it('should NOT find the task - WRONG ID', function(done){
      Task.findById('538dfb6e5cc8b9f1069585b2', function(t){
        expect(t).to.be.null;
      });
      done();
    });
  });

  describe('.findByUserId', function(){
    it('should find the task by its userId', function(done){
      Task.findByUserId(sue._id.toString(), function(array){
        expect(array).to.have.length(2);
        expect(array[0].userId).to.deep.equal(sue._id);
      });
      done();
    });

    it('should NOT find the task by its userId - bad userId', function(done){
      Task.findByUserId('not an id', function(array){
        expect(array).to.be.null;
      });
      done();
    });

    it('should NOT find the task by its userId - wrong userId', function(done){
      Task.findByUserId('538dfb6e5cc8b9f1069585b2', function(array){
        expect(array).to.have.length(0);
      });
      done();
    });
  });

  describe('#destroy', function(){
    it('should delete a task', function(done){
      task.destroy(function(){
        Task.findByUserId(sue._id.toString(), function(task){
          expect(task).to.have.length(1);
        });
        done();
      });
    });
  });

  describe('#toggleComplete', function(){
    it('should toggle the isComplete property', function(){
      Task.findById(task._id.toString(), function(task){
        task.toggleComplete();
        expect(task.isComplete).to.be.true;
      });
    });
  });

  describe('#edit', function(){
    it('should edit the properties of the task', function(){
      Task.findById(task._id.toString(), function(task){
        task.edit({title: 'store', due: '5/14/2014', color: 'red'});
        expect(task.title).to.equal('store');
        expect(moment(task.due).format('MM/DD/YYYY')).to.equal('05/14/2014');
        expect(task.color).to.equal('red');
      });
    });
  });

  describe('#save', function(){
    it('should save a task', function(done){
      task.toggleComplete();
      task.save(function(){
        Task.findById(task._id.toString(), function(foundTask){
          expect(task.isComplete).to.be.true;
        });
        done();
      });
    });
  });

});
