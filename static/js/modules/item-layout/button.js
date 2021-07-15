import { variables } from './svg.js';

let patternHref = null;

const deleteButton = document.querySelector('button#delete');
const cancelButton = document.querySelector('button#cancel');
const resetButton = document.querySelector('button#reset');
const saveButton = document.querySelector('button#save');
const specialButtons = [ resetButton, deleteButton, cancelButton, saveButton ];

const removeFuncs = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   removeElseFocus: function(currentButton) {
      const buttons = Array.from(document.querySelectorAll('button'));

      for (let button of buttons) {
         if (button === document.querySelector('button#delete')) continue;
         if (button === currentButton) continue;
         if (button.dataset.layout) continue;
   
         button.classList.remove('focus');
         button.blur();
      }
   },
   hideElseButtons: function(currentButton, buttonArray) {
      for (let button of buttonArray) {
         if (specialButtons.indexOf(button) !== -1) continue;
   
         if (button === currentButton) {
            document.querySelector(`#${button.id}-button`).classList.remove('hidden');
         } else {
            document.querySelector(`#${button.id}-button`).classList.add('hidden');
         }
      }
   }
}

const pattenFuncs = {
   changePattern: function(pattern) {
      patternHref = pattern;
   },
   patternEvent: function(button) {
      removeFuncs.removeElseFocus(button);

      if (!button.querySelector('img')) return;
   
      const patternSrc = '/' + button.querySelector('img').src.split('/').splice(3, 4).join('/');
      button.classList.add('focus');
   
      pattenFuncs.changePattern(patternSrc);
   }
}

const events = {
   addEventListenerForButtons: function(buttons) {
      Array.from(buttons.children).forEach(button => {
         button.addEventListener('click', e => {
            e.preventDefault();         
            pattenFuncs.patternEvent(button);
         });
      });
   },
   addEventListenerForReset: function(resetButton) {
      document.addEventListener('keydown', e => {
         if (e.key === 'R') {
            removeFuncs.removeElseFocus(resetButton);
      
            const yes = confirm('Sure to reset?');
         
            if (yes) {
               removeFuncs.removeAllChildNodes(variables.usingSvg);
               pattenFuncs.changePattern(null);
               variables.usingSvg.setAttribute('style', `background: #e0e5df;`);
               document.querySelector('#svg-image-invert').value = 0;
               document.documentElement.style.setProperty('--svg-image-invert', '0');
         
               resetButton.blur();
         
               return;
            }
            resetButton.blur();
            return;
         }
      });
      resetButton.addEventListener('click', e => {
         e.preventDefault();
      
         removeFuncs.removeElseFocus(resetButton);
      
         const yes = confirm('Sure to reset?');
      
         if (yes) {
            removeFuncs.removeAllChildNodes(variables.usingSvg);
            pattenFuncs.changePattern(null);
            variables.usingSvg.setAttribute('style', `background: #e0e5df;`);
            document.querySelector('#svg-image-invert').value = 0;
            document.documentElement.style.setProperty('--svg-image-invert', '0');
      
            resetButton.blur();
      
            return;
         }
         resetButton.blur();
         return;
      });
   }
}

function changeTitle(button) {
   const title = document.querySelector('.layout-setting').querySelector('.title');
   title.textContent = button.dataset.title;
}

function toggleLayout(currentButton) {
   document.querySelector('.layout-menu').querySelectorAll('button').forEach(button => {
      if (button === currentButton) button.classList.add('focus');
      else button.classList.remove('focus');
   })
   document.querySelector('.svg-container').querySelectorAll('svg').forEach(svg => {
      if (svg.id === currentButton.dataset.layout) svg.classList.remove('hidden');
      else svg.classList.add('hidden');
   })
}

export { patternHref, removeFuncs, pattenFuncs, events, changeTitle, toggleLayout, specialButtons }