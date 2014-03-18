Meteor.publish('allRaceData', function (race_id) {
  return [
    Races.find(race_id),
    RaceData.find({ 'race_id': race_id }),
    RaceTimers.find({ 'race_id': race_id }),
    Paragraphs.find(),
  ]
});

Meteor.publish('raceChat', function (data) { // Return the selected amount of chat messages for this conversation
  return RaceChat.find({ 'race_id': data.race_id }, { 'sort': { $natural: 1 }, 'limit': data.limit });
});

Meteor.publish('rankingData', function() {
  return Ranking.find();
});

Meteor.publish('aggregates', function() {
  return Aggregates.find();
});

Meteor.publish('counts', function () {
  var self = this
    , userCount = 0
    , gameCount = 0
    , initializing = true;

  var userHandle = Meteor.users.find().observeChanges({
    added: function (id) {
      userCount++;
      if (!initializing)
        self.changed('counts', 'total_users', {count: userCount});
    },
    removed: function (id) {
      userCount--;
      self.changed('counts', 'total_users', {count: userCount});
    }
    // don't care about moved or changed
  });

  var gameHandle = Races.find().observeChanges({
    added: function (id) {
      gameCount++;
      if (!initializing)
        self.changed('counts', 'total_games', {count: gameCount});
    },
    removed: function (id) {
      gameCount--;
      self.changed('counts', 'total_games', {count: gameCount});
    }
    // don't care about moved or changed
  });

  // Observe only returns after the initial added callbacks have
  // run.  Now return an initial value and mark the subscription
  // as ready.
  initializing = false;
  self.added('counts', 'total_users', {count: userCount});
  self.added('counts', 'total_games', {count: gameCount});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    userHandle.stop();
  });
});

Meteor.users.allow({
  update: function (userId, user) {
    return userId === user._id;
  }
});

Meteor.methods({
  startLobbyTimer: function() { // Start the timer for the race start
    var user = Meteor.users.findOne(Meteor.userId());
    Races.update(user.profile.race_id, { '$set': { 'status': 'countDown' } });
    var timerValue = RACE_WAITING_TIME - 1;
    var interval = Meteor.setInterval(function() {
      if (timerValue > 0) {
        Races.update(user.profile.race_id, { '$set': { 'timer': timerValue } });
        timerValue--;
      } else {
        Meteor.clearInterval(interval);
        Races.update(user.profile.race_id, { '$set': { 'status': 'started' } });
        Meteor.call('startRaceTimer', user);
      }
    }, 1000);
  },
  startRaceTimer: function(user) {
    var timerValue = 0;
    var interval = Meteor.setInterval(function() {
      if (timerValue < 300) { // Stop the timer after 5 minutes to save database queries
        RaceTimers.update(user.profile.race_timer_id, { '$set': { 'runTimer': timerValue } });
        timerValue += 0.1;
      }
      else {
        Meteor.clearInterval(interval);
      }
    }, 100);
  },
  updateStats: function(raceDataId, language) {
    var raceData = RaceData.findOne(raceDataId);
    var key = 'averages_' + language;
    var agObj = Aggregates.findOne(key);

    // WPM
    var diff = raceData.wpm - agObj.wpm;
    var count = RaceData.find( {'finished': { '$gt': 0 }, 'wpm': { '$gt': 0 } } ).count();
    Aggregates.update(key, { '$inc': { 'wpm': diff / count } });

    // CPM
    var diff = raceData.cpm - agObj.cpm;
    var count = RaceData.find( {'finished': { '$gt': 0 }, 'cpm': { '$gt': 0 } } ).count();
    Aggregates.update(key, { '$inc': { 'cpm': diff / count } });

    // ACCURACY
    diff = raceData.accuracy - agObj.accuracy;
    count = RaceData.find( {'finished': { '$gt': 0 }, 'accuracy': { '$gt': 0 } } ).count();
    Aggregates.update(key, { '$inc': { 'accuracy': diff / count } });
  }
});