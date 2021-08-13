
    function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }

    function onSignIn(googleUser) {
      let profile = googleUser.getBasicProfile();
      // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      // console.log('Name: ' + profile.getName());
      // console.log('Image URL: ' + profile.getImageUrl());
      // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      let id_token = googleUser.getAuthResponse().id_token;
      console.log(id_token);
     
      const data = { id_token }

      const url = 'http://localhost:8080/api/auth/google';

      fetch(url,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then( resp => resp.json())
      .then( ({token}) => {
        console.log(token)

      })
      .catch(console.log)

    }


