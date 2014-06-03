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
          sue = u;
          done();
        });
      });
    });
  });

  describe('.create', function(){
    it('should create a task - string user id', function(done){
      Task.create(sue._id.toString(), {title: 'Go shopping', due: '3/11/2014', color: 'green'}, function(t){
        console.log(t);
        expect(t).to.be.an.instanceof(Task);
        expect(t._id).to.be.ok;
        expect(t.title).to.equal('Go shopping');
        expect(t.due).to.be.an.instanceof(Date);
        expect(moment(t.due).format('MM/DD/YYYY')).to.equal('3/11/2014');
        expect(t.color).to.equal('green');
        expect(t.userId).to.deep.equal(sue._id);
        expect(t.userId).to.be.an.instanceof(Mongo.ObjectID);
        expect(t.isComplete).to.be.false;
        done();
      });
    });

    it('should create a task - object user id', function(done){
      Task.create(sue._id, {title: 'salad', due:'4/14/2014', color:'green'}, function(t){
        expect(t).to.be.instanceof(Task);
        expect(t._id).to.be.ok;
        done();
      });
    });
  });
});
