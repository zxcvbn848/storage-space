const svgSrc = 'http://www.w3.org/2000/svg';

function createSvgElement(tagName, attrs) {
   // Create NameSpace (<svg> 全名為 http://www.w3.org/2000/svg -> set variable: svgSrc)
   const element = document.createElementNS(svgSrc, tagName);
   for (let name in attrs) {
      element.setAttribute(name, attrs[name]);
   }
   return element;
}

export { createSvgElement }