const svgSrc = 'http://www.w3.org/2000/svg';

const roomControllers = {
   createSvgElement: function(tagName, attrs) {
      const element = document.createElementNS(svgSrc, tagName);
      for (let name in attrs) {
         element.setAttribute(name, attrs[name]);
      }
      return element;      
   }
};

document.querySelector('[data-subNav="room"]').querySelectorAll('svg').forEach(svg => {
   svg.addEventListener('click', e => {
      parent.location.href = '/item-layout';
   });
})

document.querySelector('#new-room').addEventListener('click', e => {
   e.preventDefault();

   const svg = document.createElementNS(svgSrc, 'svg');
   svg.oncontextmenu = function() {
      return false;
   };
   svg.addEventListener('click', e => {
      parent.location.href = '/item-layout';
   });
   svg.setAttribute('width', 950);
   svg.setAttribute('height', 700);

   console.log(svg.getAttribute('width'));

   const textObject = {        
      'x': svg.getAttribute('width') / 2.75, 
      'y': svg.getAttribute('height') / 2
   };
   const text = roomControllers.createSvgElement('text', textObject);
   text.textContent = 'Click to Edit';
   svg.appendChild(text);

   document.querySelector('[data-subNav="room"]').insertBefore(svg, document.querySelector('#new-room'));

   document.querySelector('#new-room').remove();
})