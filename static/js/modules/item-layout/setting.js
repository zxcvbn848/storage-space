import { variables } from './svg.js';

function addEventListenerForInput() {
   document.querySelector('#setting-button').querySelectorAll('input').forEach(input => {
      input.addEventListener('input', inputChanged);
   });   
   document.querySelector('#setting-button').querySelectorAll('button').forEach(button => {
      button.addEventListener('click', floorChanged);
   });
}

function inputChanged(e) {
   if (e.target.name === 'svg-color') variables.usingSvg.setAttribute('style', `background: var(--${e.target.name}, #e0e5df);`);

   document.documentElement.style.setProperty(
      `--${e.target.name}`, // e.g.: --shadow-color
      e.target.value
   )
}

function floorChanged(e) {
   const floor = e.currentTarget.querySelector('img').src;

   variables.usingSvg.setAttribute('style', `background: white url(${floor})`);

   document.documentElement.style.setProperty('--svg-color', '#e0e5df');
   document.querySelector('#setting-button').querySelector('input#svg-color').value = '#e0e5df';
}

export { addEventListenerForInput }
