// signinConfirmModels
let signinConfirmModels = {
   userData: null,
   signoutState: null,
   signinCheck: function() {
      if (!signinConfirmModels.userData && parent.location.href.split('/')[parent.location.href.split('/').length - 1] !== '') parent.location.href = '/';
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
         .then(result => this.signoutState = result);
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

      if (userData) {
         signoutButton.classList.remove('hidden');
         memberButton.classList.remove('hidden');
         itemLinks.forEach(link => {
            for (let i = 0; i < link.children.length; i++) link.children[i].classList.remove('hidden');
         });
         if (signinForm) {
            signupForm.parentNode.classList.add('hidden');
            signinForm.parentNode.classList.add('hidden');
            
            const textElement = document.createElement('div');
            textElement.classList.add('text');
            textElement.textContent = `
               Welcome, ${userData.name}.
               You can create your first storage record!
            `;
            mainElement.appendChild(textElement);
         }
      } else {
         signoutButton.classList.add('hidden');
         memberButton.classList.add('hidden');
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
      const signoutSuccess = signinUpModels.signoutState['ok'];
      const signoutFailed = signinUpModels.signoutState['error'];

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
signoutButton.addEventListener('click', signinConfirmControllers.signoutCheck);
