window.fbAsyncInit = function() {
  FB.init({
    // appId   : '230831707094422', // DEV App Id
    appId   : '556639047754442', // App ID
    status  : true, // check login status
    cookie  : true, // enable cookies to allow the server to access the session
    xfbml   : true  // parse XFBML
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = '//connect.facebook.net/en_GB/all.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

shareOnFacebook = function(name, cpm, wpm) {
  var site_url = 'http://keyboardrace.com';
  var logo = site_url + '/logo-256.png';

  FB.ui({
    method: 'stream.publish',
    display: 'iframe',
    user_message_prompt: 'Share your results with your friends!',
    attachment: {
      name: 'Keyboard Race',
      caption: site_url,
      description: name + ' scored ' + cpm + ' character per minute (WPM: ' + wpm + ') in Keyboard Race!',
      href: site_url,
      media:[{
        'type': 'image',
        'src': 'http://keyboardrace.com/logo-256.png',
        'href': 'http://keyboardrace.com/logo-256.png'
      }]
    },
    action_links: [{ text: 'Keyboard Race', href: site_url }]
  },
  function(response) {
    if (response && response.post_id) {
      $('#share-on-facebook').fadeOut();
    } else {
      // If failed?
    }
  });
}