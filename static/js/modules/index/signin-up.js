// signinUpModels
let signinUpModels = {
   signinState: null,
   signupState: null,
   signoutState: null,
   // Data Authentication
   dataAuth: function(element) {
      const emailPattern = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]{2,6}$/;
      const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
      
      if (element.nameElement) {
         if (element.passwordElement.value !== element.passwordCheckElement.value) return false;

         if (element.passwordElement.value.length < 4 ?? element.passwordCheckElement.value.length < 4 ?? element.emailElement.value.length === 0 ?? element.nameElement.value.length === 0) {
            return false;
         }   
      }

      if (element.passwordElement.value.length < 4 ?? element.emailElement.value.length === 0) {
         return false;
      }

      const patternBoolean = emailPattern.test(element.emailElement.value) && passwordPattern.test(element.passwordElement.value) && passwordPattern.test(element.passwordCheckElement.value);
      
      return patternBoolean;
   },   
   fetchPatchUserAPI: function() {
      /* hash, TBD */

      const emailElement = document.getElementById('signin-email');
      const passwordElement = document.getElementById('signin-password');

      const signinElements = {
         emailElement,
         passwordElement
      }

      // const dataAuth = signinUpModels.dataAuth(signinElements);

      const src = '/api/user';
      return fetch(src, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "email": emailElement.value,
               "password": passwordElement.value
            })
         })
         .then(response => response.json())
         .then(result => this.signinState = result);
   },
   fetchPostUserAPI: function() {
      /* hash, TBD */

      const nameElement = document.getElementById('signup-name');
      const emailElement = document.getElementById('signup-email');
      const passwordElement = document.getElementById('signup-password');
      const passwordCheckElement = document.getElementById('signup-password-check');

      const signupElements = {
         nameElement,
         emailElement,
         passwordElement,
         passwordCheckElement
      }
      
      // const dataAuth = signinUpModels.dataAuth(signupElements);

      const src = '/api/user';
      return fetch(src, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "name": nameElement.value,
               "email": emailElement.value,
               "password": passwordElement.value,
               "password_check": passwordCheckElement.value
            })
         })
         .then(response => response.json())
         .then(result => this.signupState = result);
   }
};

// signinUpViews
let signinUpViews = {
   // Signin success or not
   signinSuccessDetermine: function() {
      const signinSuccess = signinUpModels.signinState['ok'];
      const signinFailed = signinUpModels.signinState['error'];
      
      const emailElement = document.getElementById('signin-email');
      const passwordElement = document.getElementById('signin-password');
   
      if (signinSuccess) location.reload();
      if (signinFailed) alert(signinUpModels.signinState['message']);

      emailElement.value = '';
      emailElement.innerText = '';
      passwordElement.value = '';
      passwordElement.innerText = '';
   },
   // Signup success or not
   signupSuccessDetermine: function() {
      const signupSuccess = signinUpModels.signupState['ok'];
      const signupFailed = signinUpModels.signupState['error'];

      const nameElement = document.getElementById('signup-name');
      const emailElement = document.getElementById('signup-email');
      const passwordElement = document.getElementById('signup-password');
      const passwordCheckElement = document.getElementById('signup-password-check');

      if (signupSuccess) alert('Sign Up Success');
      if (signupFailed) alert(signinUpModels.signupState['message']);

      nameElement.value = '';
      nameElement.innerText = '';
      emailElement.value = '';
      emailElement.innerText = '';
      passwordElement.value = '';
      passwordElement.innerText = '';
      passwordCheckElement.value = '';
      passwordCheckElement.innerText = '';
   }
};

// signinUpControllers
let signinUpControllers = {
   // Signup Authentication
   signupCheck: function() {
      signinUpModels.fetchPostUserAPI()
         .then(() => {
            signinUpViews.signupSuccessDetermine();
         })
         .then(() => {
            signinUpModels.signupState = null;
         })
         .catch(error => console.log(error));
   },
   // Signin Authentication
   signinCheck: function() {
      signinUpModels.fetchPatchUserAPI()
         .then(() => {
            signinUpViews.signinSuccessDetermine();
         })
         .then(() => {
            signinUpModels.signinState = null;
         })
         .catch(error => console.log(error));
   },
};

// For signin & signup Authentication
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

signupForm.addEventListener('submit', e => {
   e.preventDefault();

   signinUpControllers.signupCheck();
});

signinForm.addEventListener('submit', e => {
   e.preventDefault();

   signinUpControllers.signinCheck();
});