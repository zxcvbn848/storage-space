const settingModels = {
   userData: null,
   changeState: null,
   fetchGetUser: function() {
      const src = '/api/user';
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            this.userData = result.data;
         });
   },
   fetchPostPs: function() {
      const oldPassword = document.querySelector('#old-password').value;
      const newPassword = document.querySelector('#new-password').value;
      const newPasswordConfirm = document.querySelector('#new-password-confirm').value;

      const src = '/api/setting/ps';
      return fetch(src, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "old_password": oldPassword,
               "new_password": newPassword,
               "new_password_confirm": newPasswordConfirm,
            })
         })
         .then(response => response.json())
         .then(result => this.changeState = result);
   }
};

const settingViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   renderUserData: function() {
      document.querySelector('[data-user="name"]').textContent = `Name: ${settingModels.userData.name}`;
      document.querySelector('[data-user="email"]').textContent = `Email: ${settingModels.userData.email}`;
      document.querySelector('#room-list').textContent = `${settingModels.userData.name}'s Room`;
   },
   checkOAuth: function() {
      if (settingModels.userData.provider === 'google') {
         const passwordArea = document.querySelector('[data-setting="password"]');
         this.removeAllChildNodes(passwordArea);
         const title = document.createElement('div');
         title.classList.add('title');
         title.textContent = 'Change Password';

         const hr = document.createElement('hr');

         const textElement = document.createElement('div');
         textElement.textContent = 'Hi! You have signed in from Google, so don\'t need to change.'

         passwordArea.appendChild(title);
         passwordArea.appendChild(hr);
         passwordArea.appendChild(textElement);
      }
      return;
   },
   alertChangePassword: function() {
      const oldPassword = document.querySelector('#old-password');
      const newPassword = document.querySelector('#new-password');
      const newPasswordConfirm = document.querySelector('#new-password-confirm');

      if (settingModels.changeState.ok === true) {
         alert(settingModels.changeState.message);
         oldPassword.innerText = '';
         oldPassword.value = '';
         newPassword.innerText = '';
         newPassword.value = '';
         newPasswordConfirm.innerText = '';
         newPasswordConfirm.value = '';
      }
      else {
         alert(settingModels.changeState.message);
      }
   }
};

const settingControllers = {
   toggleSetting: function(currentButton) {
      document.querySelector('[data-subNav="setting"]').querySelector('ul').querySelectorAll('button').forEach(button => {
         if (button === currentButton) button.classList.add('focus');
         else button.classList.remove('focus');
      });
      document.querySelectorAll('[data-setting]').forEach(part => {
         if (part === document.querySelector(`[data-setting="${currentButton.id}"]`)) part.classList.remove('hidden');
         else part.classList.add('hidden');
      });
   },
   showUserData: function() {
      settingModels.fetchGetUser()
         .then(() => settingViews.renderUserData())
         .then(() => settingViews.checkOAuth())
         .then(() => settingModels.userData = null)
         .catch(error => console.log(error));
   },
   changePassword: function() {
      settingModels.fetchPostPs()
         .then(() => settingViews.alertChangePassword());
   }
};

settingControllers.showUserData();

document.querySelector('[data-subNav="setting"]').querySelectorAll('button').forEach(button => {
   if (button === document.querySelector('[data-setting="password"]').querySelector('button')) return;
   button.addEventListener('click', e => {
      e.preventDefault();
      settingControllers.toggleSetting(button);
   })
});

document.querySelector('[data-setting="password"]').addEventListener('submit', e => {
   e.preventDefault();
   settingControllers.changePassword();
})