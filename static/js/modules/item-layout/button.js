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
      button.classList.remove('focus');
      button.blur();
   }
}

function patternEvent(button) {
   const patternSrc = button.querySelector('img').src;
   button.classList.add('focus');
   removeElseFocus(button);

   changePattern(patternSrc);
}

function addEventListenerForButtons(buttons) {
   Array.from(buttons.children).forEach(button => {
      button.addEventListener('click', e => {
         e.preventDefault();
         patternEvent(button);
      });
   })
}

function addEventListenerForReset(resetButton, svg) {
   resetButton.addEventListener('click', e => {
      e.preventDefault();
   
      removeElseFocus(resetButton);
   
      const yes = confirm('Sure to reset?');
   
      if (yes) {
         removeAllChildNodes(svg);
         changePattern(null);
   
         resetButton.blur();
   
         return;
      }
      resetButton.blur();
      return;
   });
}

function hideElseButtons(currentButton, resetButton) {
   const buttons = Array.from(document.querySelector('.menu').querySelectorAll('button'));
   for (let button of buttons) {
      if (button === resetButton) return;
      if (button === currentButton) {
         document.querySelector(`#${button.id}-button`).classList.remove('hidden');
      } else {
         document.querySelector(`#${button.id}-button`).classList.add('hidden');
      }
   }
}


export { patternHref, addEventListenerForButtons, addEventListenerForReset, hideElseButtons }