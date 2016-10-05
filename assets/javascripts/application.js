var $ = require('jquery');

var channels = [{id: 1, channel: "ESL_SC2"}, {id: 2, channel: "OgamingSC2"}, {id: 3, channel: "cretetion"}, {id: 4, channel: "freecodecamp"}, {id: 5, channel: "storbeck"}, {id: 6, channel: "habathcx"}, {id: 7, channel: "RobotCaleb"}, {id: 8, channel: "noobs2ninjas"}, {id: 9, channel: "monstercat"}, {id: 10, channel: "medrybw"}, {id: 11, channel: "brunofin"}, {id: 12, channel: "comster404"}];

// {id: 11, channel: "brunofin"}

var template = '<li class="User-item-padded"><div class="User-item"><div class="Avatar"></div><div class="User-info"><p><a href="#" class="User-name"></a><span class="Status"></span></p><p class="Game"></p><p id="error"></p></div></div></div></li>';

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
    bannerImage(nodo, response);
  }).fail(function(error) {
    updateError(nodo, error);
  });
};

function updateError(nodo, data) {
  var channelError = JSON.parse(data.responseText);
  nodo.find('.Avatar').append('<img src="images/logo.svg" alt="logo" class="logo-default">');
  nodo.find("#error").html(channelError.message);
  nodo.find(".User-item").toggleClass("Background-gradient");

}

$(function() {
  channels.forEach(function(channel) {
    var nodo = createNodo(channel);
    urlStream("streams", channel.channel, nodo);
    urlChannels("channels", channel.channel, nodo);
  });

  onlineGamers();
  offlineGamers();
  allGamers();
  filterInput();
});

function createNodo(channel) {
  var nodo = $(template);
  nodo.attr('id', 'channel' + channel.id);
  users.append(nodo);
  return nodo;
}

function filterInput(str) {
  //var nodo = $(".Error-search");

  $("#input-search").on("keyup", function(e) {
    var search = $("#input-search").val();

    if ($.trim(search) !== '') {
      $('.User-item-padded').each(function () {
        var nodo = $(this);
        var algo = nodo.find('.User-name').text();

        if (algo.indexOf(search) !== -1) {
          nodo.show();

        } else {
          nodo.hide();
          $(".Error-search").removeClass("is-hidden");
        }
      });
    } else {
       $('.User-item-padded').show();
    }
  });
}

function updateData(nodo, data) {
  var status;
  var jsClass;

  if(data.stream === null) {
    status = " - Offline";
    jsClass = 'js-offline';
  } else if (data.stream === undefined) {
    status = " - Account Closed"
    jsClass = 'js-closed';
  } else {
    status = " - Online";
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
    avatar.append('<img src="images/logo.svg" alt="logo" class="logo-default">');
  } else {
    avatar.append('<img src="' + userLogo +'" alt="logo">');
  }
}

function infoUserName(nodo, user) {
  var userName = user.name;
  var urlChannel = user.url;
  nodo.find(".User-name").html(userName).attr("href", urlChannel);
}

function bannerImage(nodo, image) {
  var banner = image.profile_banner;
  if( banner !== null) {
    nodo.find(".User-item").css({'background-image': 'url('+ banner + ')',
                                 'background-size': 'cover'});
  } else {
    nodo.find(".User-item").toggleClass("Background-gradient");
  }
}

function onlineGamers() {
  $("#button-online").on("click", function(e) {
    e.preventDefault();

    $('.User-item-padded').hide();
    $('.User-item-padded.js-online').show();
  });
}

function offlineGamers() {
  $("#button-offline").on("click", function(e) {
    e.preventDefault();

    $('.User-item-padded').hide();
    $('.User-item-padded.js-offline').show();
  });
}

function allGamers() {
  $("#button-all").on("click", function(e) {
    e.preventDefault();

    $('.User-item-padded').show();
  });
}


