Meteor.loginAsGuest = function(username, callback) {
  return Accounts.callLoginMethod({
    methodArguments: [{ username: username }],
    userCallback: callback
  });
};

afterLogin = function(err) {
  if(err) {
    //error handling
  } else {
    if (!Meteor.user().profile.race_id) {
      Meteor.call('joinGame', getCurrentLanguage());
    }
    if (!Meteor.user().profile.volume) {
      Meteor.users.update(Meteor.userId(), { '$set': { 'profile.volume': true } });
    }
  }
}

Template.user_loggedout.events({
  'click #facebook-login': function(e, tmpl) {
    Meteor.loginWithFacebook({ requestPermissions: [] }, afterLogin);
    ga('send', 'event', 'Race', 'Start');
    ga('send', 'event', 'Login', 'Facebook');
  },

  'click #twitter-login': function(e, tmpl) {
    Meteor.loginWithTwitter({ requestPermissions: [] }, afterLogin);
    ga('send', 'event', 'Race', 'Start');
    ga('send', 'event', 'Login', 'Twitter');
  },

  'click #guest-login': function(e, tmpl) {
    Meteor.loginAsGuest($('#username').val(), afterLogin);
    ga('send', 'event', 'Race', 'Start');
    ga('send', 'event', 'Login', 'Guest');
  },

  'keyup #username': function(e, tmpl) {
    if(e.which == 13) {
      Meteor.loginAsGuest($('#username').val(), afterLogin);
    }
  }
});

Template.user_loggedin.events({
  'click #logout': function(e, tmpl) {
    Meteor.logout(function(err) {
      if(err) {
        //sow err message
      } else {
        Session.set('section', 'main');
        ga('send', 'event', 'Logout');
      }
    });
  }
});