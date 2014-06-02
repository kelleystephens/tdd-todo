/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'todo-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../app/app');
var request = require('supertest');
var traceur = require('traceur');

var User;

describe('User', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      User = traceur.require(__dirname + '/../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      done();
    });
  });

  describe('.register', function(){
    beforeEach(function(done){
      var obj = {email:'sue@aol.com', password:'1234'};
      User.register(obj, function(){
        done();
      })
    });

    it('should successfully register a user', function(done){
      var obj = {email:'bob@aol.com', password:'1234'};
      User.register(obj, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(u.password).to.have.length(60);
        done();
      });
    });

    it('should NOT successfully register a user', function(done){
      var obj = {email:'sue@aol.com', password:'1234'};
      User.register(obj, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

});
