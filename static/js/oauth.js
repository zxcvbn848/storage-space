function onLoad() {
   gapi.load('auth2', () => {
     gapi.auth2.init();
   });
 }

const oauthModels = {
   signinState: null,
}

const oauthViews = {
   signinSuccessDetermine: function() {
      const signinSuccess = oauthModels.signinState['ok'];
      const signinFailed = oauthModels.signinState['error'];
         
      if (signinSuccess) {
         parent.location.href = '/member';
         return;
      }
      if (signinFailed) alert(oauthModels.signinState['message']);
   },
};

function onSignIn(googleUser) {
   const id_token = googleUser.getAuthResponse().id_token;

   return fetch('/api/oauth', {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            'id_token': id_token
         })
      })
   .then(response => response.json())
   .then(result => oauthModels.signinState = result)
   .then(() => oauthViews.signinSuccessDetermine());
};