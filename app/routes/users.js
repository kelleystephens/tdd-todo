'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.login = (req,res)=>{
  User.login(req.query, u=>{
    console.log(u);
    if(u){
      req.session.userId = u._id;
      res.render('user/index', {user: u});
    }else{
      req.session.userId = null;
      res.redirect('home/index');
    }
  });
};

exports.register = (req, res)=>{
  User.register(req.body, u=>{
    if(u){
      req.session.userId = u._id;
      res.render('user/index', {user: u});
    }else{
      req.session.userId = null;
      res.redirect('home/index');
    }
  });
};

exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, u=>{
    res.locals.user = u;
    next();
  });
};
