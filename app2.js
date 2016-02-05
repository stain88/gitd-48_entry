var currentLevel = 0;
var score = 0;
var levelInfo;
var levels = [function(){gotoLevelOne()},function(){gotoLevelTwo()},function(){gotoLevelThree()}, function(){gotoWinScreen()}]
var kongregate;
localStorage.finalScore = localStorage.finalScore || btoa(0);

$(document).ready(function() {
  setInterval('cursorBlink()',1000);
  mainMenu();
});

var mainMenu = function() {
  $('#window-size').fadeIn(1000, function() {
    $('#jumb-title').fadeIn(1500, function() {
      $('#start-button, #options-button').fadeIn(2000, menuListeners)
    })
  })
};

var menuListeners = function() {
  $('#start-button').off().one("click",function(ev) {
    ev.preventDefault();
    newLevel(currentLevel);
  });
  $('#options-button').off().one("click",function(ev) {
    ev.preventDefault();
    gotoOptions();
  });
};

var gotoOptions = function() {
  $('#start-button, #options-button').fadeOut(1000).promise().done(function() {
    if ($('#options-text').length===0) {
      $('<p/>', {
        text: 'Options? What options?',
        'class': 'text-center',
        'id': 'options-text'
      }).appendTo('div#window-size').hide().fadeIn(1000);
    } else {
      $('#options-text').fadeIn(1000);
    }
    if ($('#btmain-button').length===0) {
      $('<button/>', {
        text: 'Back to main',
        'class': 'btn btn-lg btn-primary btn-block',
        'id': 'btmain-button',
        click: function() {backToMain();}
      }).appendTo('div#window-size').hide().fadeIn(1000);
    } else {
      $('#btmain-button').fadeIn(1000);
    }
  });
};

var backToMain = function() {
  $('#options-text').fadeOut(1000);
  $('#btmain-button').fadeOut(1000, mainMenu);
}

var gotoLevelOne = function() {
  new Counter((new Date()).getTime());
  $('h3#zone').text("Zone One");
  var introMessages = ["Welcome, test subject #"+Math.floor(Math.random()*100+2000), "Your mission is to escape", "Type the password to unlock the door", "The faster, the better, but beware wrong answers!", "To get started, type 'help'"],
      files = {"clue1": "/(Cyb|Risk)?\\dr[A-Z]\\d?unk/", "clue2": "The clue's in the theme", "clue3": "Try some regex"},
      password = ["Cyb3rPunk"];
  levelInfo = new Level(introMessages, files, password);
  timer(30000, function(timeleft) {return levelInfo.bonus = timeleft});
  $('#jumb-title, #start-button, #options-button').fadeOut(1000).promise().done(function() {
    $('.info').fadeIn();
    $('.progress, .well-cstm, .input').fadeIn(1500).promise().done(function() {
      levelInfo.introMessages.forEach(function(message, index) {
        $.wait(index*message.length*80).then(function(){addCommand(message)});
      });
    });
  });
  $('#query-form').submit(function(event) {
    event.preventDefault();
    addCommand($('#query').val(), "green");
    runQuery($('#query').val());
    $('#query').val("");
  })
};

var gotoLevelTwo = function() {
  $('h3#zone').text("Zone Two");
  var introMessages = ["","Found that easy, did you?", "Let's move on"],
      files = {"clue":"What has a head but never weeps, has a bed but never sleeps, can run but never walks, and has a bank but no money?"},
      password = ["river", "a river"];
  levelInfo = new Level(introMessages, files, password);
  timer(30000, function(timeleft) {return levelInfo.bonus = timeleft});
  levelInfo.introMessages.forEach(function(message, index) {
    $.wait((index+1)*message.length*60).then(function(){addCommand(message)});
  });
};

var gotoLevelThree = function() {
  $('h3#zone').text("Zone Three");
  var introMessages = ["", "Good luck with this one"],
      files = {"part1":"/^[A-Z]\\d{2}k[\\s\\&]*R/", "part2":"/(24|ew|my)[3-7]*[bard].$/", "clue1":"In need of a mechanic?"},
      password = ["R15k & Rew4rd"];
  levelInfo = new Level(introMessages, files, password);
  timer(30000, function(timeleft) {return levelInfo.bonus = timeleft});
  levelInfo.introMessages.forEach(function(message, index) {
    $.wait((index+1)*message.length*60).then(function(){addCommand(message)});
  });
};

var gotoWinScreen = function() {
  $('.info, .progress, .well-cstm, .input').fadeOut(1000).promise().done(function() {
    $('.win-jumb').fadeIn(1000);
    $('#final').text(score);
    saveScore(score);
  })
}

var saveScore = function(score) {
  if (score > parseInt(atob(localStorage.finalScore))) {
    localStorage.finalScore = btoa(score);
    kongregate.stats.submit("FinalScore",parseInt(atob(localStorage.score)));
  }
}

var addCommand = function(msg, color) {
  $('li:last #caption').addClass(color);
  $('ul.console').append(showText($('li:last #caption'),msg,0,50))
  $.wait(msg.length*10).then(function(){$('ul.console').append('<li><span>> </span><span id="caption"></span><span class="cursor">|</span></li>')});
};

var showText = function (target, message, index, interval) {
  if (index < message.length) {
    $(target).append(message[index++]);
    setTimeout(function() {
      showText(target, message, index, interval); 
    }, interval);
  }
  $('.well-cstm').scrollTop($('.well-cstm')[0].scrollHeight);
  $('li:nth-last-child(2) .cursor').hide();
}

function runQuery(query) {
  query = query.trim();
  query = query.split(" ").filter(Boolean);
  answer = query.slice(1).join(" ");
  switch(query[0]) {
    case "help":
      var helpMessages=["Type 'ls' to view all files","Type 'cat' and file name to view file contents","Type 'password ' and your answer to progress","Type 'help' to view this menu"];
      $.wait(400).then(function(){
        helpMessages.forEach(function(message, index) {
          $.wait((index+1)*message.length*60).then(function(){addCommand(message,"turquoise");
          });
        });
      })
      break;
    case "ls":
      setTimeout(function(){addCommand("The files are: ","turquoise")}, 200);
      Object.keys(levelInfo.files).forEach(function(key, index) {
        $.wait((index+1)*key.length*100).then(function(){addCommand(key,"turquoise")});
      })
        
      break;
    case "cat":
      var found = false;
      Object.keys(levelInfo.files).forEach(function(key) {
        if (key === query[1].toLowerCase()) {
          $.wait(200).then(function(){addCommand("The contents of "+key+" are: ","turquoise")});
          $.wait(key.length*100).then(function(){addCommand(levelInfo.files[key],"turquoise")});
          found = true;
        }
      })
      if (!found) setTimeout(function(){addCommand("File not found","red")},200);
      break;
    case "password":
      if (levelInfo.password.indexOf(answer)>-1) {
        setTimeout(function(){
          addCommand("Correct!")
        },500);
        $.wait(1000).then(function(){
          $('span#score').text(score+=100+(levelInfo.bonus*50));
          $('ul.console li').fadeOut(1000).remove();
          $('.progress-bar').width((100*(currentLevel+1)/(levels.length-1))+"%");
        }).done(function() {
          $.wait(1000).then(function(){newLevel(++currentLevel)});
        });
      } else {
        setTimeout(function(){addCommand("Incorrect!","red")},200);
      }
      break;
    default:
      setTimeout(function(){addCommand("Command not found","red")}, 200);
  }
}

function cursorBlink() {
  $('.cursor').animate({
        opacity: 0
    }, 'slow', 'swing').animate({
        opacity: 1
    }, 'slow', 'swing');
}

function newLevel(lvl) {
  levels[lvl]();
}

function Level (introMessages, files, password) {
  this.introMessages = introMessages;
  this.files = files;
  this.password = password;
}

$.wait = function(time) {
  return $.Deferred(function(dfd) {
    setTimeout(dfd.resolve, time);
  });
}

function Counter(initDate){
  this.counterDate = new Date(initDate);
  this.countainer = $('#time');
  this.borrowed = 0, this.hours = 0, this.minutes = 0, this.seconds = 0;
  this.updateCounter();
}

Counter.prototype.datePartDiff=function(then, now, MAX){
  var diff = now - then - this.borrowed;
  this.borrowed = 0;
  if ( diff > -1 ) return diff;
  this.borrowed = 1;
  return (MAX + diff);
}

Counter.prototype.calculate=function(){
  var futureDate = this.counterDate > new Date()? this.counterDate : new Date();
  var pastDate = this.counterDate == futureDate? new Date() : this.counterDate;
  this.seconds = this.datePartDiff(pastDate.getSeconds(), futureDate.getSeconds(), 60);
  this.minutes = this.datePartDiff(pastDate.getMinutes(), futureDate.getMinutes(), 60);
  this.hours = this.datePartDiff(pastDate.getHours(), futureDate.getHours(), 24);
}
  
Counter.prototype.addLeadingZero=function(value){
  return value < 10 ? ("0" + value) : value;
}
  
Counter.prototype.formatTime=function(){
  this.seconds = this.addLeadingZero(this.seconds);
  this.minutes = this.addLeadingZero(this.minutes);
  this.hours = this.addLeadingZero(this.hours);
}
  
Counter.prototype.updateCounter=function(){
  this.calculate();
  this.formatTime();
  this.countainer.html("<strong>" + this.hours + "</strong>:<strong>" + this.minutes + "</strong>:<strong>"+this.seconds+"</strong>");
  var self = this;
  setTimeout(function(){self.updateCounter();}, 1000);
}

function timer(time,update) {
  var start = new Date().getTime();
  var interval = setInterval(function() {
    var now = time-(new Date().getTime()-start);
    if( now < 0) {
      clearInterval(interval);
    }
    else update(Math.floor(now/1000));
  },100);
}

kongregateAPI.loadAPI(onComplete);
function onComplete() {
  kongregate = kongregateAPI.getAPI();
}

