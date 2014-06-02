'use strict';

var users = global.nss.db.collection('users');
var bcrypt = require('bcrypt');

class User{
  static register(obj, fn){
    // users.findOne({email:obj.email}, (e,u)=>{
    //   if(u){
    //     fn(null);
    //   }else{
        var user = new User();
        user.email = obj.email;
        user.password = bcrypt.hashSync(obj.password, 8);
        users.save(user, (e,u)=>fn(u));
      // }
    // });

  }
}


module.exports = User;
