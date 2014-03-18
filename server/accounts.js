// Callback from SNS logins
Accounts.onCreateUser(function (options, user) {
  if(user.services.facebook) {
    user.profile = {
      avatar_url: 'http://graph.facebook.com/' + user.services.facebook.id  +'/picture',
      name: user.services.facebook.name
    }
  }

  if(user.services.twitter) {
    user.profile = {
      avatar_url: user.services.twitter.profile_image_url,
      name: user.services.twitter.screenName
    }
    delete user.services.twitter.profile_image_url;
    delete user.services.twitter.profile_image_url_https;
  }

  return user;
});

// TODO: FIXME - Should update user.profile.avatar_url if twitter profile image changed

// Guest login handler
Accounts.registerLoginHandler(function(loginRequest) {
  var cutoff, stampedToken, user, userId;
  if (!loginRequest.username) {
    return;
  }

  // Truncate until 12th character
  username = loginRequest.username.substr(0, 30);
  userId = Meteor.users.insert({
    profile: { name: username, avatar_url: null },
    createdAt: new Date
  });
  stampedToken = Accounts._generateStampedLoginToken();
  Meteor.users.update(userId, {
    $push: {
      'services.resume.loginTokens': stampedToken
    }
  });

  cutoff = +(new Date) - (24 * 3600) * 1000;
  Meteor.users.update(userId, {
    $pull: {
      'services.resume.loginTokens': {
        when: {
          $lt: cutoff
        }
      }
    }
  }, {
    multi: true
  });
  return {
    id: userId,
    token: stampedToken.token
  };
});

Meteor.userIP = function(uid) {
  var k, ret, s, ss, _ref, _ref1, _ref2, _ref3;
  ret = {};
  if (uid != null) {
    _ref = Meteor.default_server.sessions;
    for (k in _ref) {
      ss = _ref[k];
      if (ss.userId === uid) {
        s = ss;
      }
    }
    if (s) {
      ret.forwardedFor = ( _ref1 = s.socket) != null ?
        ( _ref2 = _ref1.headers) != null ?
          _ref2['x-forwarded-for'] : void 0 : void 0;
      ret.remoteAddress = ( _ref3 = s.socket) != null ?
        _ref3.remoteAddress : void 0;
    }
  }

  return ret.forwardedFor ? ret.forwardedFor : ret.remoteAddress;
};