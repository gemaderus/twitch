var $ = require('jquery');

var channels = [{id: 1, channel: "ESL_SC2"}, {id: 2, channel: "OgamingSC2"}, {id: 3, channel: "cretetion"}, {id: 4, channel: "freecodecamp"}, {id: 5, channel: "storbeck"}, {id: 6, channel: "habathcx"}, {id: 7, channel: "brunofin"}, {id: 8, channel: "noobs2ninjas"}, {id: 9, channel: "medrybw"}, {id: 10, channel: "monstercat"}, {id: 11, channel: "RobotCaleb"}, {id: 12, channel: "comster404"}];

var template = '<div class="User-item"><div class="Avatar"></div><div class="User-info"><p><a href="#" class="User-name"></a><span class="Status"></span></p><p class="Game"></p><p id="error"></p></div></div></div>';

var users = document.getElementById("user-items");

function makeURL(type, name) {
  return 'https://api.twitch.tv/kraken/' + type + '/' + name + '?client_id=c09cvez4remudiu2rau8edykwhpp3t0';
}

function ajaxCall(url, callback) {
  var xhr = new XMLHttpRequest();
  var data;
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      if(xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
        callback(data);
      } else {
        updateError();
      }
    }
  }

  xhr.open("GET", url, true);
  xhr.send();
}

function urlStream(type, item, nodo) {
  ajaxCall(makeURL(type, item), function(response) {
    updateData(nodo, response);
  });
};

function urlChannels(type, item, nodo) {
  ajaxCall(makeURL(type, item), function(response) {
    infoUserName(nodo, response);
    infoLogo(nodo, response);
    bannerImage(nodo, response);
  });
};

function updateError(nodo, data) {
  var channelError = JSON.parse(data.responseText);
  nodo.querySelectorAll(".Avatar").forEach(function(item, index, array) {
    item.innerHTML = '<img src="images/logo.svg" alt="logo" class="logo-default">';
  });

  nodo.querySelector("#error").innerHTML = channelError.message;

  nodo.querySelectorAll(".User-item").forEach(function(item, index, array) {
    item.classList.toggle("Background-gradient");
  });
}

// function updateError(nodo, data) {
//   var channelError = JSON.parse(data.responseText);
//   nodo.find('.Avatar').append('<img src="https://www.dropbox.com/s/gtx0nldzgy38sxu/logo.svg?raw=1" alt="logo" class="logo-default">');
//   nodo.find("#error").html(channelError.message);
//   nodo.find(".User-item").toggleClass("Background-gradient");

// }

function createNodo(channel) {
  var nodo = document.createElement("li");
  nodo.className = "User-item-padded";
  nodo.innerHTML = template;
  nodo.setAttribute('id', 'channel' + channel.id);

  users.appendChild(nodo);

  return nodo;
}

function filterInput(str) {
  var inputSearch = document.getElementById("input-search");

  inputSearch.addEventListener("keyup", function(e) {
    var search = inputSearch.value;

    if (search.trim !== '') {
      var container = document.getElementsByClassName('User-item-padded').forEach(function (nodo) {
        var text = nodo.querySelectorAll('.User-name').textContent;

        if (text.indexOf(search) !== -1) {
          nodo.style.display = ''; //nodo.show();

        } else {
          nodo.style.display ="none"; //nodo.hide();
          document.getElementbyClassName("Error-search").classList.remove("is-hidden");
        }
      });
    } else {
       document.getElementsByClassName('User-item-padded').style.display = '';
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

  nodo.querySelector(".Status").innerHTML = status;

  nodo.classList.add(jsClass);
  onlineData(nodo, data);
}

function onlineData(nodo, item) {
  if (!item.stream) {
    return;
  }

  var game = item.stream.game;
  nodo.querySelector(".Game").innerHTML= game;
}

function infoLogo(nodo, user) {
  var userLogo = user.logo;
  var avatar = nodo.querySelectorAll('.Avatar');

  avatar.forEach(function(item, index, array) {
    var image = document.createElement('img');

    if(userLogo === null) {
      image.src = "images/logo.svg";
      image.classList.add("logo-default");
    } else {
      image.src = userLogo;
    }

    item.appendChild(image);
  });
}

function infoUserName(nodo, user) {
  var userName = user.name;
  var urlChannel = user.url;
  nodo.querySelector(".User-name").href = urlChannel;
  nodo.querySelector(".User-name").innerHTML = userName;
}


function bannerImage(nodo, image) {
  var banner = image.profile_banner;
  if( banner !== null) {
    nodo.querySelectorAll(".User-item").forEach(function(item, index, array) {
      item.style.backgroundImage = 'url('+ banner + ')';
      item.style.backgroundSize = 'cover';
    });

  } else {
    nodo.querySelectorAll(".User-item").forEach(function(item, index, array) {
      item.classList.toggle("Background-gradient");
    });
  }
}

function onlineGamers() {

  buttonOnline = document.getElementById("button-online");
  buttonOnline.addEventListener("click", function(e) {

    e.preventDefault();

    var li = document.getElementsByClassName("User-item-padded");

    li.forEach(function(item, index, array) {
      item.style.display = 'none';
    });

    li.forEach(function(item, index, array) {
      item.style.display = '';
    });
  });
}

function offlineGamers() {
  buttonOffline = document.getElementById("button-offline");
  var li = document.getElementsByClassName("User-item-padded");

  buttonOffline.addEventListener("click", function(e) {
    e.preventDefault();

    li.style.display = 'none';
    li.style.display = '';
  });
}

function allGamers() {
  buttonAll = document.getElementById("button-all");
  var li = document.getElementsByClassName("User-item-padded");

  buttonAll.addEventListener("click", function(e) {
    e.preventDefault();

    li.style.display = 'none';
  });
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

