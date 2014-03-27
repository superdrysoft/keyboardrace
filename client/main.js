var chat_message_alternate = true;

Template.main.raceVisible = function() {
  return Session.equals('section', 'race') || Session.equals('section', 'loading');
};

Template.race_header.loadingVisible = function() {
  return Session.equals('section', 'loading');
};

Template.race_header.volumeOff = function() {
  var user = Meteor.user();
  if (user) {
    return !user.profile.volume;
  }
  return false;
};

Template.race_header.raceStarted = Template.restart.raceStarted = function() {
  return Session.equals('section', 'race');
};

Template.loading.race = function() {
  return Session.get('race');
};

Template.loading.raceCounting = function() {
  if (!Session.equals('race', undefined)) {
    return Session.get('race').status === 'countDown'
  }
};

Template.users.users = function() {
  if (!Session.equals('race', undefined)) {
    return RaceData.find({ 'race_id': Session.get('race')._id });
  }
};

Template.paragraph.showInput = function() {
  if (!Session.equals('race', undefined)) {
    return Session.equals('race_finished', 0) && Session.get('race').status === 'started';
  }
  return false;
};

Template.paragraph.showParagraph = function() {
  if (!Session.equals('race', undefined)) {
    return (Session.get('race_finished') > 0 || Session.get('race').status === 'started');
  }
  return false;
};

Template.paragraph.paragraph = function () {
  if (!Session.equals('race', undefined)) {
    return Session.get('race').paragraph;
  }
};

Template.reference.paragraph = function() {
  if (Session.get('race')) {
    return Paragraphs.findOne(Session.get('race').paragraph_id, { 'reactive': false }); // Don't need reactivity
  }
};

Template.restart.raceData = function() {
  return {
    finished: Session.get('race_finished'),
    cpm: Session.get('race_cpm'),
    wpm: Session.get('race_wpm'),
    accuracy: Math.floor(Session.get('race_accuracy'))
  };
};

// RIGHT WIDGETS ---------------------

Template.ranking.flag = function() {
  return getCurrentLanguage();
};

Template.ranking.globalRank = function() {
  return Session.equals('globalRank', true);
};

Template.ranking.ranks = function() {
  var i = 1;

  var rankFrom = new Date();

  if(Session.equals('globalRank', true)) {
    rankFrom.setYear(1985);
  } else {
    rankFrom.setDate(rankFrom.getDate() - 7);
  }

  return Ranking.find({
    'language': getCurrentLanguage(),
    'created_at': { '$gt': rankFrom }
  }, {
    sort: { 'cpm': -1 },
    limit: 10,
    transform: function(document) {
      document.position = i;
      i++;
      return document;
    }
  }).fetch();
};

Template.stats_widget.totalUsers = function() {
  return Counts.findOne('total_users');
};

Template.stats_widget.totalGames = function() {
  return Counts.findOne('total_games');
};

Template.stats_widget.aggregates = function() { // TODO: CPM
  if (ag = Aggregates.findOne('averages_' + getCurrentLanguage())) {
    ag.cpm = ag.cpm.toFixed(1);
    ag.wpm = ag.wpm.toFixed(1);
    ag.accuracy = ag.accuracy.toFixed(1);
    return ag;
  }
};

Template.chat_widget.globalChat = function() {
  return Session.get('globalChat');
}

Template.chat.hasMessages = function() {
  return !Match.test(RaceChat.findOne(), undefined);
}

Template.chat.messages = function() {
  return RaceChat.find();
}

Template.language_widget.currentLanguage = function() {
  return getCurrentLanguage();
};

// RENDERED CALLBACKS --------------------

Template.restart.rendered = function() {
  $('#share-on-facebook').show();
};

Template.user.rendered = function() {
  if (!Session.get('race').paragraph) return;

  // Move the car and wpm forward with a css transform
  $track = $('#user-' + this.data.order);
  transform = 'translate(' + ((this.data.progress / Session.get('race').paragraph.length) * ( $(this.find('.track')).width() - $(this.find('.avatar')).width() + 10 ) ) + 'px, 0px)';
  $track.find('.avatar').css('transform', transform);
  $track.find('.avatar-cpm').css('transform', transform).html(this.data.cpm);
  if (Meteor.userId() === this.data.user_id) {
    // Set sessions for necessary race data
    var self = this;
    _.each(['progress', 'order', 'finished', 'wpm', 'cpm', 'accuracy'], function(key) {
      if (!Session.equals('race_' + key, self.data[key])) {
        Session.set('race_' + key, self.data[key]);
      }
    });
  };
};

Template.language_widget.rendered = function() {
  DropDown.bind('#select-language', 'button', 'ul');
};

Template.typer_input.rendered = function() {
  TypeChecker.init();
};

Template.chat.rendered = function() {
  $('#chat-message-container').scrollTop($('#chat-message-container')[0].scrollHeight).scrollLock();
}

// EVENT BINDINGS ---------------------

Template.user.events({
  'mouseenter .track-outer': function(evt) {
    $(evt.target).find('.user-name-inner').addClass('expanded');
  },
  'mouseleave .track-outer': function(evt) {
    $(evt.target).find('.user-name-inner').removeClass('expanded');
  }
});

Template.race_header.events({
  'click #volume-control': function(evt) {
    Meteor.call('toggleVolume');
  }
});

Template.loading.events({
  'click #play-solo': function (evt) {
    Meteor.call('startRace');
    ga('send', 'event', 'Race', 'SoloPlay');
  }
});

Template.restart.events({
  'click #share-on-facebook': function(evt) {
    shareOnFacebook(Meteor.user().profile.name, Session.get('race_cpm'), Session.get('race_wpm'));
  }
});

Template.paragraph.events({
  // We can use one 'textInput' event, but not supported on IE < 9
  'keydown #typer-input': function (evt) {
    TypeChecker.keydown(evt);
  }
});

Template.restart.events({
  'click #play-again-btn': function (evt) {
    Meteor.call('joinGame', getCurrentLanguage());
    ga('send', 'event', 'Race', 'Restart');
  }
});

Template.language_widget.events({
  'click .widget-header': function(evt) {
    $('#widget-language').find('.openable').toggleClass('expanded');
  },
  'click .widget-body > div': function(evt) {
    changeLanguage($(evt.target).attr('title'));
    $('#widget-language').find('.icon.check').removeClass('active');
    $(evt.target).find('.icon.check').addClass('active');
    $('#widget-language').find('.openable').toggleClass('expanded');
  }
});

Template.chat_widget.events({
  'click .widget-header > div': function(evt) {
    Session.set('globalChat', $(evt.target).data('globalchat'));
  }
});

Template.ranking.events({
  'click .column-header > .header-block': function(evt) {
    Session.set('globalRank', $(evt.target).data('globalrank'));
  }
});

Template.chat.events({
  'keyup #send-message': function(evt) {
    value = evt.target.value;
    if(evt.keyCode === 13 && value.replace(/\s+/, '') !== '' && evt.shiftKey !== true) {
      Meteor.call('sendChatMessage', value, Session.get('globalChat') ? 'global_' + getCurrentLanguage() : false);
      evt.target.value = '';
      evt.preventDefault();
      return false;
    }
  }
});

Meteor.startup(function() {
  TypingEffect.start();
  Session.set('chat_limit', 10000);
  Session.set('globalChat', false);
  Session.set('globalRank', false);

  var computation = Deps.autorun(function() { // Every time we get an application change, run this function
    Meteor.subscribe('rankingData');
    Meteor.subscribe('counts');
    Meteor.subscribe('aggregates');

    if (Meteor.userId()) {
      var me = Meteor.user();
      if (me && me.profile.race_id) { // When a user gains a race ID (i.e placed in a race lobby) subscribe it to race changes
        Meteor.subscribe('allRaceData', me.profile.race_id);
        var race = Races.findOne(me.profile.race_id);
        Session.set('race', race);
        if (race && race.status === 'started') {
          Session.set('section', 'race');

        } else if (race && (race.status === 'waiting' || race.status === 'countDown')) {
          Session.set('section', 'loading');
        }
      }
    }
  });

  var computation = Deps.autorun(function() { // Every time we get an application change, run this function
    if (Session.get('race')) {
      Meteor.subscribe('raceChat', {
        'race_id': Session.get('globalChat') ? 'global_' + getCurrentLanguage() : Session.get('race')._id,
        'limit': Session.get('chat_limit')
      });
    }
  });
});

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-49111835-2', 'keyboardrace.com');
ga('send', 'pageview');

