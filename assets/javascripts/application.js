var $ = require('jquery');

var channels = [{id: 1, channel: "ESL_SC2"}, {id: 2, channel: "OgamingSC2"}, {id: 3, channel: "cretetion"}, {id: 4, channel: "freecodecamp"}, {id: 5, channel: "storbeck"}, {id: 6, channel: "habathcx"}, {id: 7, channel: "RobotCaleb"}, {id: 8, channel: "noobs2ninjas"}];

var template = '<li class="User-item"><div class="is-flex flex-center-item"><div class="Avatar"></div><div class="User-info"><p><a href="#" class="User-name"></a><span class="Status"></span></p><p class="Game"></p></div></div></li>';

var users = $("#user-items");

function makeURL(type, name) {
  return 'https://api.twitch.tv/kraken/' + type + '/' + name + '?client_id=c09cvez4remudiu2rau8edykwhpp3t0';
}

function urlStream(type, item, nodo) {
  $.getJSON(makeURL(type, item), function(response) {
    updateData(nodo, response);
  });
};

function urlChannels(type, item, nodo) {
  $.getJSON(makeURL(type, item), function(response) {
    infoUserName(nodo, response);
    infoLogo(nodo, response);
  });
};

$(function() {
  function getInfo() {
    channels.forEach(function(channel) {
      var nodo = createNodo(channel);
      urlStream("streams", channel.channel, nodo);
      urlChannels("channels", channel.channel, nodo);

    });
  }
  getInfo();
});

function createNodo(channel) {
  var nodo = $(template);
  nodo.attr('id', 'channel' + channel.id);
  users.append(nodo);
  return nodo;
}

function updateData(nodo, data) {
  var status;
  var jsClass;

  if(data.stream === null) {
    status = "- Offline";
    jsClass = 'js-offline';
  } else if (data.stream === undefined) {
    status = "- Account Closed"
    jsClass = 'js-closed';
  } else {
    status = "- Online";
    jsClass = 'js-online';
  };

  nodo.find(".Status").html(status);
  nodo.addClass(jsClass);
  onlineData(nodo, data);
}

function onlineData(nodo, item) {
  if (!item.stream) {
    return;
  }

  var game = item.stream.game;
  nodo.find(".Game").html(game);
}

function infoLogo(nodo, user) {
  var userLogo = user.logo;
  var avatar = nodo.find('.Avatar');

  if(userLogo === null) {
    avatar.append('<img src="images/logo.svg" alt="logo" class="logo-default">');//preguntar
  } else {
    avatar.append('<img src="' + userLogo +'" alt="logo">');
  }
}

function infoUserName(nodo, user) {
  var userName = user.name;
  nodo.find(".User-name").html(userName);
}

// $("#button-all").on("click", function(e) {
//   return getInfo();
// });

// $("#button-online").on("click", function(e) {
//   var Gamers = data.stream;
//   var nodo = $(template);

//   onlineGamers.filter(function (online) {
//     var onlineGamers = (data.stream !== null && data.stream !== undefined);
//     return onlineGamers;
//   })

// });

