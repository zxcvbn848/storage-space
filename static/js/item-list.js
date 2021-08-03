import {} from './signin-confirm.js';
import {} from './modules/navbar/navbar.js';
import {} from './modules/item-list/list.js';

const goTop = document.querySelector('#goTop'); 
const goBottom = document.querySelector('#goBottom');

const itemListControllers = {
   goTop: function() {
      window.scrollTo(0, 0);
   },
   goBottom: function() {
      window.scrollTo(0, document.body.scrollHeight);
   },
};

goTop.addEventListener('click', e => {
   e.preventDefault();

   itemListControllers.goTop();
});
goBottom.addEventListener('click', e => {
   e.preventDefault();

   itemListControllers.goBottom();
});