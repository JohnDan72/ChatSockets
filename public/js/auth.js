const miForm = document.querySelector('form');
const url = 'http://localhost:8080/api/auth/';

miForm.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {}

    for (let element of miForm.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value
        }
    }

    fetch(url + 'login', {
            method: 'post',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(myData => {
            console.log(myData)
            localStorage.setItem('token', myData.token);
            window.location = 'chat.html'
        })
        .catch(err => {
            console.log(err);
        })
})

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}

function onSignIn(googleUser) {
    // let profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    let id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);

    const data = { id_token }


    fetch(url + 'google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            console.log(token);
            window.location = 'chat.html'

        })
        .catch(console.log)

}