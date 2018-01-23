$(document).ready(function() {
  var config = {
    apiKey: 'AIzaSyBCVgvNV0gko5O9rNFgQv8aXrtZOF2gzeM',
    authDomain: 'fir-p-a292a.firebaseapp.com',
    databaseURL: 'https://fir-p-a292a.firebaseio.com',
    projectId: 'fir-p-a292a',
    storageBucket: 'fir-p-a292a.appspot.com',
    messagingSenderId: '215671637058'
  };
  firebase.initializeApp(config);

  // autenticando al usuario con google
  var provider = new firebase.auth.GoogleAuthProvider();
  $('#button-google').on('click', function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      // ...
    });
  });
  // realizando acciones cuando el usuario este autenticado
  firebase.auth().onAuthStateChanged(function(user) {
    // si el usuario esta activo
    if (user) {
      window.location.href = '../views/perfil.html';
    } else {
      console.log('usuario no logeado');
    }
  });
});
