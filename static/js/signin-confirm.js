// signinConfirmModels
let signinConfirmModels = {
   userData: null,
   signoutState: null,
   signinCheck: function() {
      if (parent.location.href.split('/')[parent.location.href.split('/').length - 1] === 'signin-up') return;
      if (!signinConfirmModels.userData && parent.location.href.split('/')[parent.location.href.split('/').length - 1] !== '') parent.location.href = '/signin-up';
   },
   // fetch /api/user with GET
   fetchGetUserAPI: function() {
      const src = '/api/user';
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            this.userData = result.data;
         });
   },
   // Signout
   fetchDeleteUserAPI: function() {
      const src = '/api/user';
      return fetch(src, {
            method: 'DELETE'
         })
         .then(response => response.json())
         .then(result => {
            const auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut();
            
            this.signoutState = result;
         });
   }
};

// signinConfirmViews
let signinConfirmViews = {
   // Signin check for navbar display
   signinDetermine: function() {
      const userData = signinConfirmModels.userData;

      const itemLinks = document.querySelector('#item-link').querySelectorAll('li');
      const signupForm = document.getElementById('signup-form');
      const signinForm = document.getElementById('signin-form');
      const mainElement = document.querySelector('main');
      const signinupLink = document.querySelector('#signin-up');

      if (userData) {
         signoutButton.classList.remove('hidden');
         memberButton.classList.remove('hidden');
         signinupLink.classList.add('hidden');
         itemLinks.forEach(link => {
            for (let i = 0; i < link.children.length; i++) link.children[i].classList.remove('hidden');
         });
         if (signinForm) {
            signupForm.parentNode.classList.add('hidden');
            signinForm.parentNode.classList.add('hidden');
         }
      } else {
         signoutButton.classList.add('hidden');
         memberButton.classList.add('hidden');
         signinupLink.classList.remove('hidden');
         itemLinks.forEach(link => {
            for (let i = 0; i < link.children.length; i++) link.children[i].classList.add('hidden');
         });
         if (signinForm) {
            signupForm.parentNode.classList.remove('hidden');
            signinForm.parentNode.classList.remove('hidden');

            if (mainElement.querySelector('.text')) mainElement.removeChild(mainElement.querySelector('.text'));
         }
      }
   },
   // Signout 
   signoutSuccessDetermine: function() {
      const signoutSuccess = signinConfirmModels.signoutState['ok'];
      const signoutFailed = signinConfirmModels.signoutState['error'];

      if (signoutSuccess) location.reload();
      if (signoutFailed) alert(result['message']);
   }
};

// signinConfirmControllers
let signinConfirmControllers = {
   // Signin check for navbar display
   signinConfirm: function() {
      signinConfirmModels.fetchGetUserAPI()
         .then(() => signinConfirmModels.signinCheck())
         .then(() => signinConfirmViews.signinDetermine())
         .then(() => signinConfirmModels.userData = null)
         .catch(error => console.log(error));
   },
   // Signout
   signoutCheck: function() {
      const yes = confirm('Sure to sign out?');
      
      if (yes) {
         signinConfirmControllers.signout();
      } else {
         return;
      }
   },
   signout: function() {
      signinConfirmModels.fetchDeleteUserAPI()
         .then(() => signinConfirmViews.signoutSuccessDetermine())
         .then(() => signinConfirmModels.signoutState = null)
         .catch(error => console.log(error));
   }
};

signinConfirmControllers.signinConfirm();
/* member */
const memberButton = document.getElementById('member-button');
/* signout */
const signoutButton = document.getElementById('signout-button');
signoutButton.addEventListener('click', e => {
   e.preventDefault();
   signinConfirmControllers.signoutCheck();
});

export { signinConfirmControllers }
