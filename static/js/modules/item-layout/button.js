function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
}

let patternHref = null;

function changePattern(pattern) {
   patternHref = pattern;
}

function removeElseFocus(currentButton) {
   const buttons = Array.from(document.querySelectorAll('button'));
   for (let button of buttons) {
      if (button === currentButton) continue;
      if (button === document.querySelector('button#delete')) continue;

      button.classList.remove('focus');
      button.blur();
   }
}

function patternEvent(button) {
   removeElseFocus(button);

   if (!button.querySelector('img')) return;

   const patternSrc = button.querySelector('img').src;
   button.classList.add('focus');

   changePattern(patternSrc);
}

function addEventListenerForButtons(buttons) {
   Array.from(buttons.children).forEach(button => {
      button.addEventListener('click', e => {
         e.preventDefault();         
         patternEvent(button);
      });
   });
}

function addEventListenerForReset(resetButton, svg) {
   resetButton.addEventListener('click', e => {
      e.preventDefault();
   
      removeElseFocus(resetButton);
   
      const yes = confirm('Sure to reset?');
   
      if (yes) {
         removeAllChildNodes(svg);
         changePattern(null);
         document.querySelector('svg').setAttribute('style', `background: #e0e5df;`);
         document.querySelector('#svg-image-invert').value = 0;
         document.documentElement.style.setProperty('--svg-image-invert', '0');
   
         resetButton.blur();
   
         return;
      }
      resetButton.blur();
      return;
   });
}

function hideElseButtons(currentButton, buttonArray, specialButtons) {
   for (let button of buttonArray) {
      if (specialButtons.indexOf(button) !== -1) continue;

      if (button === currentButton) {
         document.querySelector(`#${button.id}-button`).classList.remove('hidden');
      } else {
         document.querySelector(`#${button.id}-button`).classList.add('hidden');
      }
   }
}

function changeTitle(button) {
   const title = document.querySelector('.layout-setting').querySelector('.title');
   title.textContent = button.dataset.title;
}

export { patternHref, addEventListenerForButtons, addEventListenerForReset, hideElseButtons, changeTitle, removeElseFocus, changePattern }