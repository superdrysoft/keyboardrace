Handlebars.registerHelper('t', function(namespace, options) {
  if(_.isString(options)) {
    namespace += options;
    return __(namespace);
  } else {
    return __(namespace, options);
  }
});

Handlebars.registerHelper("locale", function(conditional, options) {
  if (conditional.hash.language === Meteor.getLocale()) {
    return true;
  } else {
    return false
  }
});

// Build a wheel instead including 10KB moment library
pluralize = function (num, unit) {
  var base = num + ' ' + unit;
  if(num === 1) {
    return base;
  } else {
    return base + 's';
  }
};

Handlebars.registerHelper('formattedDate', function(d) {
  var now = new Date();
  var diff = parseInt((now.getTime() - d.getTime()) / 1000);

  if(diff < 60) {
    return 'Just now';
  }

  if(diff < 3600) {
    return pluralize(parseInt(diff / 60), 'minute') + ' ago';
  }

  if(diff < 86400) {
    return pluralize(parseInt(diff / 3600), 'hour') + ' ago';
  }

  var date = d.getDate()
    , month = d.getMonth() + 1
    , year = d.getFullYear();

  return (year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date));
});

getCurrentLanguage = function() {
  return (Meteor.getLocale() || 'en');
}

// Sound player
SoundPlayer = (function() {
  var support = false;
  var keyboardSound, errorSound;

  if('Audio' in window) {
    support = true;
    keyboardSound = new Audio('/sounds/keyboard.mp3');
    errorSound = new Audio('/sounds/error.mp3');
  }

  var isSoundOn = function() {
    return support && !$('#volume-control').hasClass('off');
  }

  return {
    keyboard: function() { if(isSoundOn()) keyboardSound.play(); },
    error: function() { if(isSoundOn()) errorSound.play(); }
  };
})();

// Fancy Logo
TypingEffect = (function() {
  var text = '<Keyboard race <<<<<Race'.split('');
  var target = '#logo';
  var timer;

  return {
    start: function() {
      if(text.length > 0) {
        var character = text.shift();
        if(character == '<') {
          var t = $(target).text();
          $(target).text(t.substr(0, t.length - 1));
        } else {
          $(target).append(character);
        }
        timer = setTimeout('TypingEffect.start()', 100);
      } else {
        clearTimeout(timer);
      }
    }
  };
})();

TypeChecker = (function() {
  var $target, paragraph;
  var error = false; // Check error for accuracy calc

  var markWord = function() {
    // Move cursor to the next word
    $current = $('#paragraph .word.selected');
    $current.removeClass('selected').addClass('pass');
    $current.next().addClass('selected');
    SoundPlayer.keyboard();
  };

  completeRace = function() {
    $target.prop('disabled', true);
    Meteor.call('raceRank');
    ga('send', 'event', 'Race', 'Complete');
  };

  checkInput = function() {
    var string = $target.val();
    var i = string.length;
    if (i === 0) {
      return true;
    }

    // Check until the second last characters if Non-ASCII characters
    if (!/^[\000-\177]*$/.test(string)) {
      i--;
    }

    var test = string.substr(0, i);
    var actual = paragraph[Session.get('race_progress')].substr(0, i);

    if ($.trim(test) === actual) { // Correct
      $target.removeClass('misspell');

      if(string === paragraph[Session.get('race_progress')] + ' ') { // Send word to server
        $target.val('');
        markWord();

        Meteor.call('incrementRaceProgress', $.trim(string), error);
        error = false;

        if (Session.get('race_progress') + 1 === paragraph.length) {
          completeRace();
        }
      }

      return true;
    } else { // Incorrect
      if (!$target.hasClass('misspell')) {
        $target.addClass('misspell');
        SoundPlayer.error();
        error = true;
      }

      return false;
    }
  };

  return {
    init: function() {
      var race = Session.get('race');

      if (race && race.paragraph && !Session.equals('race_progress', undefined) && !Session.equals('race_order', undefined)) {

        if (race.status === 'countDown' && race.timer > 0) {
          $('title').html('(' + race.timer + ') - Keyboard Race');
        } else {
          $('title').html('Keyboard Race');

          $target = $('#typer-input');
          paragraph = race.paragraph;

          $('#paragraph .word:first').addClass('selected');
          for (var i = 0; i < Session.get('race_progress'); i++) { // Add every word before the current progress to 'pass'
            markWord();
          }
          $('#user-' + Session.get('race_order')).addClass('user-track');

          $target.focus();
        }
      }
    },

    keydown: function(evt) {
      var keycode = evt.which || evt.keyCode;

      if(keycode > 46 || keycode === 32) {
        Meteor.setTimeout(checkInput, 10);
      }
    }
  };
})();

changeLanguage = function(code) {
  Meteor.setLocale(code);
}

DropDown = (function() {
  return {
    bind: function(container, button, content) {
      var $content = $(content);

      $(container).on('mouseup', 'button', function(evt) {
        var position = $(this).position();

        if ($content.hasClass('hidden')) {
          $content.css('top', (position.top + 21) + 'px').css('left', position.left + 'px').removeClass('hidden');
          evt.stopPropagation();

          return $('body').unbind().mouseup(function(e) {
            if (!$content.is(e.target) && $content.has(e.target).length === 0) {
              $content.addClass('hidden');
              return $('body').unbind();
            }
          });
        } else {
          return $content.addClass('hidden');
        }
      });

      $content.on('click', 'li', function(evt) {
        changeLanguage($(this).attr('title'));
      });
    }
  };
})();