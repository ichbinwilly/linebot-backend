'use strict';

 /* global $ io Cookies */
 $(function () {
  $("#msgn").bind("click", function () {
    console.log("You finally clicked");
  })});

$(document).ready(function () {
  var socket = io(); // initialise socket.io connection
  socket.on('mytime', function(timeString) {
    console.log(timeString);
    renderMessage(timeString);
    scrollToBottom();
  });
  function getName () {
    // prompt for person's name before allowing to post
    //var name = Cookies.get('name');

    //if (!name || name === 'null') {
    //  name = window.prompt('What is your name/handle?'); // eslint-disable-line
    //  Cookies.set('name', name);
    //}
    //socket.emit('io:name', name);
    $('#message').focus(); // focus cursor on the message input

    //return name;
  }

  function leadZero (number) {
    return (number < 10) ? '0' + number : number;
  }

  function getTime (timestamp) {
    var t, h, m, s;

    t = new Date(timestamp);
    h = leadZero(t.getHours());
    m = leadZero(t.getMinutes());
    s = leadZero(t.getSeconds());

    return String(h) + ':' + m + ':' + s;
  }

  /**
   * renders messages to the DOM. nothing fancy. want fancy? ask!
   * @param {String} message - the message (stringified object) to be displayed.
   * @returns {Boolean} false;
   */
  function renderMessage (message) {
    var msg = JSON.parse(message);
    var html = '<li class=\'row\'>';
    html += '<small class=\'time\'>' + getTime(msg.t) + ' </small>';
    html += '<span class=\'name\'>' + '<a id="msgn" data-test="'+msg.n+'">  <img src="'+msg.pictureUrl+'" width="80px"/> </a></span>';
    html += '<p class=\'msg\'>' + msg.m + '</p>';
    html += '</li>';
    $('#messages').append(html);  // append to list
  }
  $(document.body).on('click','#msgn', function(e) {
     console.log($(this).text());
     console.log($(this).data("test"));
     $("#to").val($(this).data("test"));
    });

  //$('form').submit(function () {
  //  console.log('form submit');
  //  console.log($('#message').val());
  //  console.log($('#to').val());
  //  var msg;
    /*
    // if input is empty or white space do not send message
    if ($('#message').val()
      .match(/^[\s]*$/) !== null) {
      $('#message').val('');
      $('#message').attr('placeholder', 'please enter your message here');
    } else if (!Cookies.get('name') || Cookies.get('name').length < 1
      || Cookies.get('name') === 'null') {
      getName();
    } else {
      msg = $('#message').val();
      socket.emit('io:message', msg);
      $('#message').val(''); // clear message form ready for next/new message
      $('#message').attr('placeholder', ''); // clears placeholder once a msg is successfully sent
    }
    */
  //  return false;
  //});

  // keeps latest message at the bottom of the screen
  // http://stackoverflow.com/a/11910887/2870306
  function scrollToBottom () {
    $(window).scrollTop($('#messages').height());
  }

  window.onresize = function () {
    scrollToBottom();
  };

  socket.on('chat:messages:latest', function (msg) {
    // console.log('>> ' + msg);
    renderMessage(msg);
    scrollToBottom();
  });

  socket.on('chat:people:new', function (name) {
    $('#joiners').show();
    $('#joined').text(name);
    $('#joiners').fadeOut(5000);
  });

  getName();

  function loadMessages () {
    /***Original*/ 
    console.log('i am loadMessages==========');
    $.get('/load', function (data) {
      console.log('hello ==============' +data);
      data.forEach(function (msg) {
        renderMessage(msg);
      });
      scrollToBottom();
    });
    

    /*
    $.get('/load', function (data) {
      console.log('hello ==============' +data);
      data.forEach(function (msg) {
        var jsonObj = JSON.parse(msg);
        $.get('/getUserPhoto',{userId: jsonObj.n}, function (userPhotoData) {
          console.log('========getUserPhoto=========: ' + userPhotoData);
          console.log(userPhotoData.pictureUrl);
          jsonObj.pictureUrl = userPhotoData.pictureUrl;
          var tojson = JSON.stringify(jsonObj);
          renderMessage(tojson);
          scrollToBottom();
        });        
      });
      
    });*/

  }

  loadMessages();








  
});
