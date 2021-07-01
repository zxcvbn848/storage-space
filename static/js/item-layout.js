import { patternHref, addEventListenerForButtons, addEventListenerForReset, hideElseButtons, changeTitle, removeElseFocus, changePattern } from './modules/item-layout/button.js';
import { mainSvg, addEventListenerForSvg, toggleDeleteMode, cancelDeleteMode, toggleDisableforButtons, readMode, editMode } from './modules/item-layout/svg.js';
import { addEventListenerForInput } from './modules/item-layout/setting.js';

/* svg event */
mainSvg.addEventListener('mousedown', e => {
   e.stopPropagation();
   addEventListenerForSvg(mainSvg, e, patternHref);
})


/* mode button */
const modeButton = document.querySelector('#mode-button');
modeButton.querySelector('#edit-mode').addEventListener('click', editMode);
modeButton.querySelector('#read-mode').addEventListener('click', readMode)

/* delete button */
const deleteButton = document.querySelector('button#delete');
deleteButton.addEventListener('click', e => {   
   changePattern(null);
   removeElseFocus(deleteButton);
   toggleDeleteMode();
   toggleDisableforButtons();
});

/* cancel button */
const cancelButton = document.querySelector('button#cancel');
cancelButton.addEventListener('click', e => {
   changePattern(null);
   removeElseFocus(cancelButton);
   cancelDeleteMode();
})

/* reset button */
const resetButton = document.querySelector('button#reset');
addEventListenerForReset(resetButton, mainSvg);

/* save button */
const saveButton = document.querySelector('button#save');
saveButton.addEventListener('click', e => {
   e.preventDefault();

   const svgString = new XMLSerializer().serializeToString(mainSvg);
   const encodedData = window.btoa(svgString);

   const src = '/api/layout';
   fetch(src, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         "svg": encodedData
      })
   })
      .then(response => response.json())
      .then(result => {
         const svgXML = window.atob(result.data);
         const parser = new DOMParser();
         const svgElement = parser.parseFromString(svgXML, 'application/xml');
         document.querySelector('.svg-container').appendChild(svgElement.documentElement);
      });
})

/* menu buttons */
const menuButtons = Array.from(document.querySelector('.menu').querySelectorAll('button'));
menuButtons.forEach(button => {
   const specialButtons = [ resetButton, deleteButton, cancelButton, saveButton ];
   if (specialButtons.indexOf(button) !== -1) return;

   button.addEventListener('click', e => {
      e.preventDefault();
      changeTitle(button);
      removeElseFocus(button);
      hideElseButtons(button, menuButtons, specialButtons);
   });
});

/* buttons of item */
document.querySelectorAll('.button-container').forEach(container => {
   if (container === document.querySelector('#setting-button')) return;
   addEventListenerForButtons(container);
});

/* input of setting */
addEventListenerForInput();