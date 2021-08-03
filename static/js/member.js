import {} from './signin-confirm.js';
import {} from './modules/member/room.js';
import {} from './modules/member/setting.js';
import {} from './modules/navbar/navbar.js';

const memberControllers = {
   toggleSubNav: function(currentButton) {
      document.querySelector('.sub-nav').querySelectorAll('button').forEach(button => {
         if (button === currentButton) button.classList.add('focus');
         else button.classList.remove('focus');
      });
      document.querySelectorAll('[data-subNav]').forEach(container => {
         if (container === document.querySelector(`[data-subNav="${currentButton.id}"]`)) container.classList.remove('hidden');
         else container.classList.add('hidden');
      });
   }
};

document.querySelector('.sub-nav').querySelectorAll('button').forEach(button => {
   button.addEventListener('click', e => {
      e.preventDefault();
      memberControllers.toggleSubNav(button);
   })
});
