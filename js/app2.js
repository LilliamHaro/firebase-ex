
$('#change-description').hide();
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
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // obteniendo datos desde la cuenta de google del usuario
      var email = user.email;
      var name = user.displayName;
      var icon = user.photoURL;
      var userCode = user.uid;
      // haciendo referencia al espacio exclusivo creado para el usuario en la basedatos
      var userRef = firebase.database().ref('users').child(userCode);
      // guardando datos del usuario en la base datos
      var firebasePostREsf = userRef.child('email');
      firebasePostREsf.set(email);
      var firebasePostREsfName = userRef.child('name');
      firebasePostREsfName.set(name);
      var firebasePostREsfIcon = userRef.child('icon');
      firebasePostREsfIcon.set(icon);
      // mostrando los datos del usuario
      userRef.on('value', function(datasnapshot) {
        var showingName = datasnapshot.child('name').val();
        var showingIcon = datasnapshot.child('icon').val();
        var showingEmail = datasnapshot.child('email').val();
        var showingDescription = datasnapshot.child('description').val();
        $('#name').text(showingName);
        $('#email').text(showingEmail);
        $('#icon img').replaceWith('<img src="' + showingIcon + '">')
        if (showingDescription) {
          $('#description').text(showingDescription);
        }
      });
      $('#show-change-description').on('click', function(event) {
        var newDescription = $('#newDescription').val('');
        $('#change-description').show();
        $('#show-change-description').hide();
      });

      // actualizando descripcion
      $('#user-description-button').on('click', function(event) {
        if ($('#newDescription').val() && $('#newDescription').val() != 0) {
          var newDescription = $('#newDescription').val();
          var firebasePostREsfDesc = firebase.database().ref('users').child(userCode).child('description');
          firebasePostREsfDesc.set(newDescription);
          $('#change-description').hide();
          $('#show-change-description').show();
        }
      });
      // guardando post tipo texto
      $('#button-post').on('click', function(event) {
        if ($('#textarea-post').val() && $('#textarea-post').val() != 0) {
          var newPost = $('#textarea-post').val();
          // var firebaseRef = firebase.database().ref('users').child(userCode);
          userRef.child('post').push(newPost);
          $('#textarea-post').val('');
        }
      });

      // guardand posts tipo imagen
      $('#image-post').on('change', savingPostImage);
      // hacinedo referencia al storega donde se van a guardar las imagenes
      var storageRef = firebase.storage().ref();
      function savingPostImage() {
        var postPhotoImageToUpload = $('#image-post').prop('files')[0];
        var uploadTaskImagePost = storageRef.child('imagenes/' + postPhotoImageToUpload.name).put(postPhotoImageToUpload);
        uploadTaskImagePost.on('state_changed', function(snapshot) {
          // aqui se puede poner cualquier animacion mientras se esper que cargue la imagen
        },
        // accion si es que ocurre algun error
        function(error) {
          alert('Hubo un error al subir la imagen');
        },
        function() {
          var downloadURL = uploadTaskImagePost.snapshot.downloadURL;
          createImagePostFirebaseNode(postPhotoImageToUpload.name, downloadURL);
        });
      };

      function createImagePostFirebaseNode(imageName, url) {
        // creando apartado para el post con imagen en el apartado del usuario en la base de edatos
        var imagePostRef = firebase.database().ref('users').child(userCode);
        // alert(imagePostRef);
        imagePostRef.child('post').push({
          imageNamePost: imageName,
          url: url});
      }
      // mostrando los post
      var firebasePostREsf = firebase.database().ref('users').child(userCode).child('post');
      firebasePostREsf.on('child_added', function(datasnapshot) {
        var postPublicado = datasnapshot.val();
        var imagePublicada = datasnapshot.child('url').val();
        if (imagePublicada) {
          var imagePostPublicado = datasnapshot.child('url').val();
          $('#publicado').prepend('<div class="posts "><img class="" height="400px" src="' + imagePostPublicado + '"></div>');
        } else {
          $('#publicado').prepend('<div class="posts">' + postPublicado + '</div>');
        }
      });
    };
  });

  // dando funcionalidad al boton de log out
  $('#out').on('click', function() {
    firebase.auth().signOut().then(function() {
      console.log('saliste');
      window.location.href = '../index.html';
    });
  });
});
