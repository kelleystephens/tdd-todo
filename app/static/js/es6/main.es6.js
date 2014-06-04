(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#register').click(register);
    $('#login').click(login);
    $('#add').click(add);
  }

  function add(e){
    var title = $('#title').val();
    var due = $('#date').val();
    var color = $('#color').val();
    console.log(title);
    console.log(due);
    console.log(color);
    e.preventDefault();
  }

  function register(e){
    var email = $('#newEmail').val();
    var pw = $('#newPw').val();
    ajax('/register', 'post', {email:email, password:pw}, h =>{
      $('#signin').empty().append(h);
    });
    e.preventDefault();
  }

  function login(e){
    var email = $('#email').val();
    var pw = $('#pw').val();
    ajax('/login', 'get', {email:email, password:pw}, h =>{
      $('#signin').html(h);
    });
    e.preventDefault();
  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
    $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
  }
})();
