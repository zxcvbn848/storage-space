import { patternHref, addEventListenerForButtons, addEventListenerForReset, hideElseButtons } from './modules/item-layout/button.js';
import { createSvgElement } from './modules/item-layout/svg.js';

let nthPattern = 1;

/* svg */
const svg = document.getElementById('svg');

svg.addEventListener('mousedown', e => {
   const width = 100;
   const height = 100;

   let x = e.clientX;
   let y = e.clientY;
   const bounding = svg.getBoundingClientRect(); // 取得 Svg 資訊
   x = x - bounding.left - width / 2;
   y = y - bounding.top - height / 2;

   if (!patternHref) return;

   const imageObject = {        
      'x': x, 
      'y': y,
      'width': width,
      'height': height,
      'href': patternHref,
   };

   const image = createSvgElement('image', imageObject);
   image.id = `image-${nthPattern}`;

   svg.appendChild(image);

   nthPattern++;
});

/* reset button */
const resetButton = document.querySelector('button#reset');

addEventListenerForReset(resetButton, svg);

/* menu buttons */
const mainItem = document.querySelector('.menu').querySelector('button#main-item');
const subItem = document.querySelector('.menu').querySelector('button#sub-item');

mainItem.addEventListener('click', e => {
	e.preventDefault();
   hideElseButtons(mainItem, resetButton);
});

subItem.addEventListener('click', e => {
	e.preventDefault();
   hideElseButtons(subItem, resetButton);
});

/* main-item buttons */
const mainItemButtons = document.querySelector('#main-item-button');
const subItemButtons = document.querySelector('#sub-item-button');

addEventListenerForButtons(mainItemButtons);
addEventListenerForButtons(subItemButtons);




