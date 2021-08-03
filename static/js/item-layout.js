import { removeFuncs, pattenFuncs, events, changeTitle, toggleLayout, specialButtons } from './modules/item-layout/button.js';
import { svgModels, svgViews, svgControllers, deleteModeControllers, toggleDisableforButtons, editModeControllers } from './modules/item-layout/svg.js';
import { addEventListenerForInput } from './modules/item-layout/setting.js';
import {} from './signin-confirm.js';
import {} from './modules/navbar/navbar.js';

/* svg event */
svgModels.fetchGetLayouts()
   .then(() => svgViews.renderLayout())
   .then(() => {
      document.querySelector('.svg-container').querySelectorAll('svg').forEach(svg => {
         svg.addEventListener('mousedown', e => {
            e.stopPropagation();
            svgControllers.addEventListenerForSvg(svg, e);
         })
      })
   });


/* mode button */
const modeButton = document.querySelector('#mode-button');
modeButton.querySelector('#edit-mode').addEventListener('click', editModeControllers.editMode);
modeButton.querySelector('#read-mode').addEventListener('click', editModeControllers.readMode);
document.addEventListener('keydown', e => {
   if (e.key === 'r') editModeControllers.readMode();
   if (e.key === 'e') editModeControllers.editMode();
});

/* delete button */
const deleteButton = document.querySelector('button#delete');
deleteButton.addEventListener('click', e => {   
   pattenFuncs.changePattern(null);
   removeFuncs.removeElseFocus(deleteButton);
   deleteModeControllers.toggleDeleteMode();
   toggleDisableforButtons();
});
document.addEventListener('keydown', e => {
   if (e.key === 'D') {
      pattenFuncs.changePattern(null);
      removeFuncs.removeElseFocus(deleteButton);
      deleteModeControllers.toggleDeleteMode();
      toggleDisableforButtons();
   }
});

/* cancel button */
const cancelButton = document.querySelector('button#cancel');
cancelButton.addEventListener('click', e => {
   pattenFuncs.changePattern(null);
   removeFuncs.removeElseFocus(cancelButton);
   deleteModeControllers.cancelDeleteMode();
   toggleDisableforButtons();
})
document.addEventListener('keydown', e => {
   if (e.key === 'C') {
      pattenFuncs.changePattern(null);
      removeFuncs.removeElseFocus(cancelButton);
      deleteModeControllers.cancelDeleteMode();
      toggleDisableforButtons();
   }
});

/* reset button */
const resetButton = document.querySelector('button#reset');
events.addEventListenerForReset(resetButton);

/* save button */
const saveButton = document.querySelector('button#save');
saveButton.addEventListener('click', e => {
   e.preventDefault();

   svgModels.fetchPostLayout()
      .then(result => {
         alert(result.message);
      })
      .then(svgModels.postLayoutState = null);
})
document.addEventListener('keydown', e => {
   if (e.key === 'S') {
      svgModels.fetchPostLayout()      
         .then(result => {
            alert(result.message);
         })
         .then(svgModels.postLayoutState = null);
   }
});

/* menu buttons */
const menuButtons = Array.from(document.querySelector('.menu').querySelectorAll('button'));
menuButtons.forEach(button => {
   if (specialButtons.indexOf(button) !== -1) return;

   button.addEventListener('click', e => {
      e.preventDefault();
      changeTitle(button);
      removeFuncs.removeElseFocus(button);
      removeFuncs.hideElseButtons(button, menuButtons);
   });
});

/* buttons of item */
document.querySelectorAll('.button-container').forEach(container => {
   if (container === document.querySelector('#setting-button')) return;
   events.addEventListenerForButtons(container);
});

/* input of setting */
addEventListenerForInput();

/* layout-menu buttons */
document.querySelector('.layout-menu').querySelectorAll('button').forEach(button => {
   button.addEventListener('click', e => {
      toggleLayout(button);
   });
});

/* Auto Save */
/* onbeforeunload */
window.addEventListener('beforeunload', e => {
   svgModels.fetchPostLayout();
   e.returnValue = '';
// TBD: signout issue
   // signinConfirmControllers.signout();
});