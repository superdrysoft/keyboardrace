RACE_WAITING_TIME = 10; // Race waiting time for other players
RACE_WAITING_TIMEOUT = 15000; // Waiting timeout in milliseconds (Fix timer crash on deployment)
MAX_RANKING = 10; // Show ranking until 10th

Paragraphs = new Meteor.Collection('paragraphs');
Races = new Meteor.Collection('races');
RaceData = new Meteor.Collection('raceData');
RaceTimers = new Meteor.Collection('raceTimers');
RaceChat = new Meteor.Collection('raceChat');
Ranking = new Meteor.Collection('ranking');
Counts = new Meteor.Collection('counts');
Aggregates = new Meteor.Collection('aggregates');

// Retrieve a random paragraph from the collection
randomParagraph = function(language) {
  var count = Paragraphs.find({ 'language': language }).count();
  var rand = Math.floor(Math.random() * count);

  return Paragraphs.find({ 'language': language }, {limit: -1, skip: rand}).fetch()[0];
};

maxLengthString = Match.Where(function (string) {
  check(string, String);
  return string.length <= 255;
});

Meteor.methods({
  joinGame: function(language) {
    var userData = {}; // User data is an object: {raceId, raceTimerId, raceDataId}
    var user = Meteor.users.findOne(Meteor.userId());

    // Find a race to join
    var raceToJoin = Races.findOne({
      '$or': [ { 'status': 'waiting' }, { 'status': 'countDown' } ],
      'users': { '$lt': 7 },
      'language': language
    }, {
      sort: { $natural: 1 }
    });

    // If no one is waiting, create a new race
    if (!raceToJoin) {
      var paragraph = randomParagraph(language);
      if(paragraph) {
          userData.raceId = Races.insert({
          'created_at': new Date(), // Creation time
          'timer': RACE_WAITING_TIME, // Countdown starting timer
          'status': 'waiting', // waiting, started, or finished
          'users': 0, // Count the users
          'language' : paragraph.language,
          'paragraph_id': paragraph._id,
          'paragraph': paragraph.content.split(' '),
          'paragraph_length' : paragraph.content.length
        });
        userData.raceTimerId = RaceTimers.insert({ 'race_id': userData.raceId, 'runTimer': 0});
      }
    } else {
      userData.raceId = raceToJoin._id;
      userData.raceTimerId = RaceTimers.findOne({ 'race_id': userData.raceId })._id;
    }

    var order = RaceData.find({ 'race_id': userData.raceId }).count() + 1; // Add one as we want the minimum order to be 1
    userData.raceDataId = RaceData.insert({
      'race_id': userData.raceId,
      'user_id': user._id,
      'name': user.profile.name,
      'order': order,
      'progress': 0,
      'wpm': 0,
      'progress_char': 0,
      'cpm': 0,
      'accuracy': 100,
      'finished': 0
    });
    Meteor.users.update(user._id, {
      '$set': {
        'profile.race_id': userData.raceId,
        'profile.race_timer_id': userData.raceTimerId,
        'profile.race_data_id': userData.raceDataId
      }
    }); // Update the cached ids in the user object

    if (raceToJoin && (raceToJoin.status === 'waiting' ||
       (raceToJoin.status == 'countDown' &&
        raceToJoin.created_at.getTime() + RACE_WAITING_TIMEOUT < (new Date).getTime()))) { // If timer crashed due to live deploy
      Meteor.call('startLobbyTimer');
    }
  },

  incrementRaceProgress: function(word, error) {
    var user = Meteor.user();
    var raceTimer = RaceTimers.findOne(user.profile.race_timer_id);
    var raceData = RaceData.findOne(user.profile.race_data_id);
    var race = Races.findOne(user.profile.race_id);
    var currentWord = race.paragraph[raceData.progress];

    if (word === currentWord) {
      // Calculate WPM and CPM
      var wpm = 0
        , cpm = 0
        , elapsedTime = raceTimer.runTimer ? raceTimer.runTimer : 1;

      wpm = Math.floor(((raceData.progress + 1) / elapsedTime) * 60);
      cpm = Math.floor(((raceData.progress_char + currentWord.length) / elapsedTime) * 60);

      // Horrible hack to calculate key input / second for Korean
      // Korean character consists of 2-4 sub-characters, and should include spaces as a key input as well
      // To calculate a real KPM, we should use a hash-table to lookup number of sub-characters of 11000 characters
      // or pre-calculated value of the word or paragraph
      if(race.language === 'ko') {
        cpm = Math.floor(cpm * 3.1);
      }

      // Calculate accuracy on word level only
      var accuracy = error ? raceData.accuracy - (100 * (1 / race.paragraph.length)) : raceData.accuracy;

      RaceData.update(
        raceData._id, // FIND
        { '$inc': { 'progress': 1, 'progress_char' : currentWord.length }, // INC
          '$set': { 'wpm': wpm, 'cpm': cpm, 'accuracy': accuracy } // SET
      });
    }
  },

  raceRank: function() {
    var user = Meteor.user();

    // Update room ranking
    var totalFinished = RaceData.find({ 'race_id': user.profile.race_id, 'finished': { '$gt': 0 } }).count() + 1;
    RaceData.update(user.profile.race_data_id, { '$set': { 'finished': totalFinished } });

    // Update global ranking
    var language = Races.findOne(user.profile.race_id).language;
    var raceData = RaceData.findOne(user.profile.race_data_id);

    var today = new Date();
    var rankingGroup = {
      'language': language,
      'created_at': { '$gt': today.setDate(today.getDate() - 7) }
    }; // Group by language, Weekly

    var rankingCount = Ranking.find(rankingGroup).count();
    var minimum = Ranking.findOne(rankingGroup, {
      sort: { 'cpm': 1 }
    });

    if (!minimum || raceData.cpm > minimum.cpm || rankingCount < MAX_RANKING) { // Update ranking table
      // var myRank = Ranking.findOne({ 'user_id': user._id, 'language': language });
      // if (myRank) { // Update my score if exist
      //   if (myRank.cpm < raceData.cpm) {
      //     Ranking.update(myRank._id, {
      //       '$set' : {
      //         'created_at' : new Date(),
      //         'cpm': raceData.cpm,
      //         'wpm' : raceData.wpm,
      //         'accuracy': Math.floor(raceData.accuracy)
      //       }
      //     });
      //   }
      // } else { // Insert my record on ranking
        // If there are more than maximum number of rankings, remove the last one and replace with mine
        if (rankingCount >= MAX_RANKING) {
          if (minimum) {
            Ranking.remove(minimum._id);
          }
        }

        Ranking.insert({
          'user_id': user._id,
          'name': raceData.name,
          'language': language,
          'created_at' : new Date(),
          'cpm': raceData.cpm,
          'wpm': raceData.wpm,
          'accuracy': Math.floor(raceData.accuracy)
        });
      // }
    }

    Meteor.call('updateStats', raceData._id, language);
  },

  startRace: function() {
    user = Meteor.user();
    Races.update(user.profile.race_id, { '$set': { 'status': 'started' } });
    Meteor.call('startRaceTimer', user);
  },

  sendChatMessage: function(message, globalString) {
    check(message, maxLengthString);
    user = Meteor.user();
    if(user) {
      RaceChat.insert({ 'race_id': globalString ? globalString : user.profile.race_id, 'user_id': user._id, 'name': user.profile.name, 'message': message, created_at: new Date() });
    }
  },

  toggleVolume: function() {
    Meteor.users.update(Meteor.userId(), { '$set': { 'profile.volume': !Meteor.user().profile.volume } });
  }
});