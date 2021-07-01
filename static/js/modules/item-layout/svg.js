const svgSrc = 'http://www.w3.org/2000/svg';

const mainSvg = document.getElementById('main-svg');

// let nthPattern = 1;

let dragged;
let rolled;
let deleteMode = false;
let editingMode = true;

function createSvgElement(tagName, attrs) {
   // Create NameSpace (<svg> 全名為 http://www.w3.org/2000/svg -> set variable: svgSrc)
   const element = document.createElementNS(svgSrc, tagName);
   for (let name in attrs) {
      element.setAttribute(name, attrs[name]);
   }
   return element;
}

function addCoordinateLimit(svg, e) {
   const width = 100;
   const height = 100;
   const imageOutline = 2;

   const bounding = mainSvg.getBoundingClientRect(); // 取得 Svg 資訊

   let x = e.clientX - bounding.left - width / 2;
   let y = e.clientY - bounding.top - height / 2;
   if (x < imageOutline) x = imageOutline;   
   if (y < imageOutline) y = imageOutline;
   const maxX = bounding.width - width - imageOutline;
   const maxY = bounding.height - height - imageOutline;
   if (x > maxX) x = maxX;
   if (y > maxY) y = maxY;

   return {
      'x': x,
      'y': y,   
      'width': width,
      'height': height,
   }
}

function addEventListenerForSvg(svg, e, patternHref) {
   console.log(svg);
   if (!patternHref || e.button !== 0 || !editingMode || deleteMode) return;
   
   addCoordinateLimit(svg, e);

   const imageObject = {        
      'x': addCoordinateLimit(svg, e).x, 
      'y': addCoordinateLimit(svg, e).y,
      'width': addCoordinateLimit(svg, e).width,
      'height': addCoordinateLimit(svg, e).height,
      'href': patternHref,
   };

   let image = createSvgElement('image', imageObject);
   // image.id = `image-${nthPattern}`;
   svg.appendChild(image);

   image.addEventListener('mousedown', e => {
      if (deleteMode || !editingMode) return;
      e.stopPropagation();
      dragged = e.target;
      drag();
   });
   image.addEventListener('wheel', e => {
      if (deleteMode || !editingMode) return;
      e.stopPropagation();
      rolled = e.target;
      imgzoom(e);
   });
   image.addEventListener('click', e => {
      if (deleteMode && editingMode) e.target.remove();
      if (!editingMode) {
         const subSvg = document.createElement('svg');
         subSvg.setAttribute('xmlns', svgSrc);
         subSvg.addEventListener('contextmenu', e => {
            return false;
         });
         document.getElementsByClassName('svg-container')[0].appendChild(subSvg);
         document.querySelector('.svg-container').querySelectorAll('svg').forEach(svg => {
            if (svg === subSvg) return;
            
            svg.classList.add('hidden');

            subSvg.addEventListener('mousedown', e => {
               addEventListenerForSvg(subSvg, e, patternHref);
            })
         })
      };
   })
   image.addEventListener('mouseover', e => {
      if (!editingMode) {
         e.target.style.cursor = 'pointer';
         return;
      };
      const eraser = document.querySelector('button#delete').querySelector('img').src;

      if (deleteMode) e.target.style.cursor = `url(${eraser}), not-allowed`;
      if (!deleteMode) e.target.style.cursor = 'move';
   })
   // nthPattern++;
}

function drag() {
   document.addEventListener('mousemove', move);
   document.addEventListener('mouseup', drop);
}
function move(e) {
   dragged.setAttribute('x', moveCoordinateLimit(e).x);
   dragged.setAttribute('y', moveCoordinateLimit(e).y);
}
function moveCoordinateLimit(e) {
   const bounding = mainSvg.getBoundingClientRect(); // 取得 Svg 資訊

   const imageOutlineArray = getStyle(dragged, 'outline').split(' ');
   const imageOutline = splitStyle(imageOutlineArray[imageOutlineArray.length - 1], 'px');

   let x = e.clientX - bounding.left - dragged.getAttribute('width') / 2;
   let y = e.clientY - bounding.top - dragged.getAttribute('height') / 2;
   if (x < imageOutline) x = imageOutline;   
   if (y < imageOutline) y = imageOutline;
   const maxX = bounding.width - dragged.getAttribute('width') - imageOutline;
   const maxY = bounding.height - dragged.getAttribute('height') - imageOutline;
   if (x > maxX) x = maxX;
   if (y > maxY) y = maxY;

   collisionDetect(dragged, shape2, imageOutline, e, bounding);

   return {
      x: x,
      y: y
   }
}
function collisionDetect(dragged, shape2, imageOutline, e, bounding) {
   const propsOfShape1 = {
      width: parseInt(dragged.getAttribute('width'), 10),
      height: parseInt(dragged.getAttribute('height'), 10),
      x: e.clientX - bounding.left - dragged.getAttribute('width') / 2,
      y: e.clientY - bounding.top - dragged.getAttribute('height') / 2,
   };
   const propsOfShape2 = {
      width: parseInt(shape2.getAttribute('width'), 10),
      height: parseInt(shape2.getAttribute('height'), 10),
      x: parseInt(shape2.getAttribute('x'), 10),
      y: parseInt(shape2.getAttribute('y'), 10),
   };

   const yLimit = propsOfShape1.y >= propsOfShape2.y - propsOfShape1.height && propsOfShape1.y <= propsOfShape2.y + propsOfShape2.height;
   const xLimit = propsOfShape1.x >= propsOfShape2.x - propsOfShape1.width && propsOfShape1.x <= propsOfShape2.x + propsOfShape2.width;

   const leftLimit = propsOfShape2.x - propsOfShape1.width <= propsOfShape1.x && propsOfShape2.x - propsOfShape1.x >= 0;
   const rightLimit = propsOfShape1.x - propsOfShape2.x <= propsOfShape2.width && propsOfShape1.x - propsOfShape2.x >= 0;
   const topLimit = propsOfShape2.y - propsOfShape1.height <= propsOfShape1.y && propsOfShape2.y - propsOfShape1.y >= 0;
   const bottomLimit = propsOfShape1.y - propsOfShape2.y <= propsOfShape2.height && propsOfShape1.y - propsOfShape2.y >= 0;

   if (leftLimit && yLimit) dragged.setAttribute('x', propsOfShape2.x - propsOfShape1.width - imageOutline * 2);
   // if (leftLimit && yLimit) x = propsOfShape2.x - propsOfShape1.width - imageOutline * 2;
   if (rightLimit && yLimit) dragged.setAttribute('x', propsOfShape2.x + propsOfShape2.width + imageOutline * 2);
   // if (rightLimit && yLimit) x = propsOfShape2.x + propsOfShape2.width + imageOutline * 2;
   if (topLimit && xLimit) dragged.setAttribute('y', propsOfShape2.y - propsOfShape1.height - imageOutline * 2);
   // if (topLimit && xLimit) y = propsOfShape2.y - propsOfShape1.height - imageOutline * 2;
   console.log(propsOfShape2.y - propsOfShape1.height, propsOfShape1.y);
   // console.log(propsOfShape2.x - propsOfShape1.width, propsOfShape1.x);
   if (bottomLimit && xLimit) dragged.setAttribute('y', propsOfShape2.y + propsOfShape2.height + imageOutline * 2);
   // if (bottomLimit && xLimit) y = propsOfShape2.y + propsOfShape2.height + imageOutline * 2;
}
function drop() {
   document.removeEventListener('mousemove', move);
   document.removeEventListener('mouseup', drop);
}

function getStyle(element, attr) {
   if (element.currentStyle) {
      return element.currentStyle[attr];
   } else {
      return getComputedStyle(element, false)[attr];
   }
}

function splitStyle(style, unit) {
   return parseInt(style.split(unit)[0], 10);
}

function imgzoom(e) {
   const minSize = 16;

   let rolledWidth = parseInt(rolled.getAttribute('width'));
   let rolledHeight = parseInt(rolled.getAttribute('height'));

   rolledWidth += e.wheelDelta * 0.1;
   rolledHeight += e.wheelDelta * 0.1;

   if (rolledWidth < minSize) rolledWidth = minSize;
   if (rolledHeight < minSize) rolledHeight = minSize;

   rolled.setAttribute('width', rolledWidth);
   rolled.setAttribute('height', rolledHeight);
   return;
}

function toggleDeleteMode() {
   deleteMode = !deleteMode;
   document.querySelector('button#delete').classList.toggle('focus');
}
function cancelDeleteMode() {
   deleteMode = false;
   document.querySelector('button#delete').classList.remove('focus');
}
function toggleDisableforButtons() {
   document.querySelectorAll('.button-container').forEach(container => {
      if (container === document.querySelector('#setting-button')) return;
      Array.from(container.children).forEach(button => {
         if (deleteMode) button.disabled = true;
         else button.disabled = false;
      });
   });
}

const shape1 = mainSvg.querySelectorAll('image')[0];
const shape2 = mainSvg.querySelectorAll('image')[1];
shape1.addEventListener('mousedown', e => {
   if (deleteMode) return;
   e.stopPropagation();
   dragged = e.target;
   drag();
});
/* function intersectRect(shape1, shape2) {
   const r1 = shape1.getBoundingClientRect();
   const r2 = shape2.getBoundingClientRect();

   // check if the two bounding boxes overlap
   return (r2.left <= r1.right || r2.right >= r1.left) || (r2.top <= r1.bottom || r2.bottom >= r1.top);
} */

function readMode() {
   editingMode = false;
   document.querySelector('button#mode').textContent = 'Read';
}
function editMode() {
   editingMode = true;
   document.querySelector('button#mode').textContent = 'Edit';
}

export { mainSvg, addEventListenerForSvg, toggleDeleteMode, cancelDeleteMode, toggleDisableforButtons, readMode, editMode }