import { patternHref, removeFuncs, pattenFuncs, changeTitle, toggleLayout } from './button.js';

const svgSrc = 'http://www.w3.org/2000/svg';

const mainSvg = document.getElementById('main-svg');

const variables = {
   dragged: null,
   rolled: null,
   deleteMode: false,
   editingMode: true,
   usingSvg: mainSvg,
};

const svgModels = {
   layoutData: [],
   postLayoutState: null,
   fetchGetLayouts: function() {
      const src = '/api/layouts';
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            this.layoutData = result.data;
         });
   },
   fetchPostLayout: function() {
      const mainSvg = document.getElementById('main-svg');
      const mainObjectArray = [];
      mainSvg.querySelectorAll('image').forEach(object => {
         const propsOfObject = {
            x: parseInt(object.getAttribute('x'), 10),
            y: parseInt(object.getAttribute('y'), 10),
            width: parseInt(object.getAttribute('width'), 10),
            height: parseInt(object.getAttribute('height'), 10),
            href: object.getAttribute('href'),
            data_layout: object.dataset.layout ? object.dataset.layout : null,
         };
         mainObjectArray.push(propsOfObject);
      });

      const mainData = {
         html_id: 'main-svg',
         object_array: mainObjectArray,
      };

      const svgArray = Array.from(document.querySelectorAll('svg:not(#main-svg)'));
      const subDataArray = [];
      for (let subSvg of svgArray) {
         const subButtonImage = document.querySelector('.layout-menu').querySelector(`button[data-layout="${subSvg.id}"]`).querySelector('img').src;

         const htmlId = subSvg.id;

         const subObjectArray = [];
         subSvg.querySelectorAll('image').forEach(object => {
            const propsOfObject = {
               x: parseInt(object.getAttribute('x'), 10),
               y: parseInt(object.getAttribute('y'), 10),
               width: parseInt(object.getAttribute('width'), 10),
               height: parseInt(object.getAttribute('height'), 10),
               href: object.getAttribute('href'),
               data_layout: object.dataset.layout ? object.dataset.layout : null,
            };
            subObjectArray.push(propsOfObject);
         });
         const subData = {
            image: subButtonImage,
            html_id: htmlId,
            object_array: subObjectArray,
         }
         subDataArray.push(subData);
      }

      const src = '/api/layout';
      return fetch(src, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "main_svg": mainData,
               "sub_svg": subDataArray,
            })
         })
            .then(response => response.json())
            .then(result => {
               alert(result.message);
            });
   },
};

const svgViews = {
   renderLayout: function() {
      if (!svgModels.layoutData) return;

      removeFuncs.removeAllChildNodes(document.querySelector('.svg-container'));
      document.querySelector('.layout-menu').querySelectorAll('button').forEach(button => {
         button.remove();
      })

      const mainSvgElement = document.createElementNS(svgSrc, 'svg');
      mainSvgElement.id = svgModels.layoutData.main_svg.html_id;

      document.querySelector('.svg-container').appendChild(mainSvgElement);

      if (svgModels.layoutData.main_svg.object) {
         for (let object of svgModels.layoutData.main_svg.object) {      
            const imageObject = {
               'x': object.x, 
               'y': object.y,
               'width': object.width,
               'height': object.height,
               'href': object.href,
            };
            
            const image = svgControllers.createSvgElement('image', imageObject);
            mainSvgElement.appendChild(image);
            const dataLayout = object.data_layout;
            if (dataLayout) {
               image.classList.add('sub');
               image.dataset.layout = dataLayout;
            }
         
            svgControllers.imageEvents(image);
         }
      }

      variables.usingSvg = mainSvgElement;

      const layoutMemu = document.querySelector('.layout-menu');
      const mainButton = document.createElement('button');
      mainButton.dataset.layout = mainSvgElement.id;
      mainButton.addEventListener('click', e => {
         toggleLayout(mainButton);
      });
      mainButton.textContent = 'Room';
      layoutMemu.appendChild(mainButton);

      mainSvgElement.querySelectorAll('image').forEach(image => {
         svgControllers.imageEvents(image);
      });

      for (let subSvg of svgModels.layoutData.sub_svg) {
         const svgElement = document.createElementNS(svgSrc, 'svg');
         svgElement.id = subSvg.html_id;
         document.querySelector('.svg-container').appendChild(svgElement);

         const layoutMemu = document.querySelector('.layout-menu');
         const subButton = document.createElement('button');
         subButton.dataset.layout = svgElement.id;
         subButton.addEventListener('click', e => {
            toggleLayout(subButton);
         });
         const img = document.createElement('img');
         img.src = subSvg.image;
         subButton.appendChild(img);
         layoutMemu.appendChild(subButton);

         for (let object of subSvg.object_array) {
            const imageObject = {
               'x': object.x, 
               'y': object.y,
               'width': object.width,
               'height': object.height,
               'href': object.href,
            };
            
            const image = svgControllers.createSvgElement('image', imageObject);
            svgElement.appendChild(image);
            const dataLayout = object.data_layout;
            if (dataLayout) {
               image.classList.add('sub');
               image.dataset.layout = dataLayout;
            }
            svgControllers.imageEvents(image);
         }

         svgElement.querySelectorAll('image').forEach(image => {
            svgControllers.imageEvents(image);
         });
      }

      toggleLayout(mainButton);
   }
};

const svgControllers = {
   createSvgElement: function(tagName, attrs) {
      // Create NameSpace (<svg> 全名為 http://www.w3.org/2000/svg -> set variable: svgSrc)
      const element = document.createElementNS(svgSrc, tagName);
      for (let name in attrs) {
         element.setAttribute(name, attrs[name]);
      }
      return element;      
   },
   addCoordinateLimit: function(e) {
      const width = 100;
      const height = 100;
      const imageOutline = 2;
   
      const bounding = variables.usingSvg.getBoundingClientRect(); // 取得 Svg 資訊
   
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
   },
   addEventListenerForSvg: function(svg, e) {
      if (!patternHref || e.button !== 0 || !variables.editingMode || variables.deleteMode) return;

      variables.usingSvg = svg;
   
      const imageObject = {        
         'x': svgControllers.addCoordinateLimit(e).x, 
         'y': svgControllers.addCoordinateLimit(e).y,
         'width': svgControllers.addCoordinateLimit(e).width,
         'height': svgControllers.addCoordinateLimit(e).height,
         'href': patternHref,
      };
   
      let image = svgControllers.createSvgElement('image', imageObject);
      svg.appendChild(image);
   
      svgControllers.imageEvents(image);
   },
   imageEvents: function(image) {
      image.addEventListener('mousedown', e => {
         if (variables.deleteMode || !variables.editingMode) return;
         e.stopPropagation();
         variables.dragged = e.target;
         variables.usingSvg = e.target.parentNode;
         dragControllers.drag();
      });
      image.addEventListener('wheel', e => {
         if (variables.deleteMode || !variables.editingMode) return;
         e.stopPropagation();
         variables.rolled = e.target;
         variables.usingSvg = e.target.parentNode;
         imgzoom(e);
      });
      image.addEventListener('click', e => {
         if (variables.deleteMode && variables.editingMode) {
            e.target.remove();
            removeFuncs.removeSvg(e.target);
         }
         variables.usingSvg = e.target.parentNode;
      });
      image.addEventListener('dblclick', e => {
         variables.usingSvg = e.target.parentNode;

         pattenFuncs.changePattern(null);

         const subItemButton = document.getElementById('sub-item');
         const menuButtons = Array.from(document.querySelector('.menu').querySelectorAll('button'));

         if (image.dataset.layout) {
            toggleLayout(document.querySelector('.layout-menu').querySelector(`button[data-layout="${image.dataset.layout}"]`));
            changeTitle(subItemButton);
            removeFuncs.removeElseFocus(subItemButton);
            removeFuncs.hideElseButtons(subItemButton, menuButtons);
            return;
         }

         image.classList.add('sub');

         const imageName = image.getAttribute('href').split('/')[image.getAttribute('href').split('/').length - 1].replace('.png', '');
         
         image.dataset.layout = `${imageName}-${Array.from(document.querySelector('.layout-menu').querySelectorAll('button[data-layout]')).length}`;
         // image.dataset.layout = imageName;

         svgControllers.addSubSvg(e, image, subItemButton, menuButtons);
      })
      image.addEventListener('mouseover', e => {
         variables.usingSvg = e.target.parentNode;
         if (!variables.editingMode) {
            e.target.style.cursor = 'pointer';
            return;
         };
         const eraser = document.querySelector('button#delete').querySelector('img').src;
   
         if (variables.deleteMode) e.target.style.cursor = `url(${eraser}), not-allowed`;
         if (!variables.deleteMode) e.target.style.cursor = 'move';
      })
   },
   addSubSvg: function(e, image, subItemButton, menuButtons) {
      e.stopPropagation();
      let subSvg;
      if (document.getElementById(image.dataset.layout)) {
         toggleLayout(document.querySelector(`button[data-layout="${image.dataset.layout}"]`));
         return;
      }

      subSvg = document.createElementNS(svgSrc, 'svg');
      subSvg.oncontextmenu = function() {
         return false;
      };
      subSvg.id = image.dataset.layout;

      const layoutMemu = document.querySelector('.layout-menu');
      const subButton = document.createElement('button');
      subButton.dataset.layout = subSvg.id;
      subButton.addEventListener('click', e => {
         toggleLayout(subButton);
      });
      const img = document.createElement('img');
      img.src = image.getAttribute('href');
      
      subButton.appendChild(img);
      layoutMemu.appendChild(subButton);
      toggleLayout(subButton);

      document.getElementsByClassName('svg-container')[0].appendChild(subSvg);
      document.querySelector('.svg-container').querySelectorAll('svg').forEach(svg => {
         if (svg === subSvg) return;
         svg.classList.add('hidden');
      });

      changeTitle(subItemButton);
      removeFuncs.removeElseFocus(subItemButton);
      removeFuncs.hideElseButtons(subItemButton, menuButtons);

      editModeControllers.editMode();
      
      variables.usingSvg = subSvg;
      if (subSvg) {
         subSvg.addEventListener('mousedown', e => {
            e.stopPropagation();
            svgControllers.addEventListenerForSvg(subSvg, e);
         });
      }
   }
};

const dragControllers = {
   drag: function() {
      document.addEventListener('mousemove', dragControllers.move);
      document.addEventListener('mouseup', dragControllers.drop);
   },
   move: function(e) {
      const bounding = variables.usingSvg.getBoundingClientRect(); // 取得 Svg 資訊

      const imageOutlineArray = styleDealers.getStyle(variables.dragged, 'outline').split(' ');
      const imageOutline = styleDealers.splitStyle(imageOutlineArray[imageOutlineArray.length - 1], 'px');
   
      let x = e.clientX - bounding.left - variables.dragged.getAttribute('width') / 2;
      let y = e.clientY - bounding.top - variables.dragged.getAttribute('height') / 2;
      if (x < imageOutline) x = imageOutline;   
      if (y < imageOutline) y = imageOutline;
      const maxX = bounding.width - variables.dragged.getAttribute('width') - imageOutline;
      const maxY = bounding.height - variables.dragged.getAttribute('height') - imageOutline;
      if (x > maxX) x = maxX;
      if (y > maxY) y = maxY;
   
      /* Get collision variable to control mode of setAttribute() */
      const collision = dragControllers.collisionDetect(imageOutline, e, bounding);
   
      if (!collision) {
         variables.dragged.setAttribute('x', x);
         variables.dragged.setAttribute('y', y);
      }
   },
   collisionDetect: function(imageOutline, e, bounding) {
      const propsOfDragged = {
         x: e.clientX - bounding.left - variables.dragged.getAttribute('width') / 2,
         y: e.clientY - bounding.top - variables.dragged.getAttribute('height') / 2,         
         // x: variables.dragged.getAttribute('x'),
         // y: variables.dragged.getAttribute('y'),
         width: parseInt(variables.dragged.getAttribute('width'), 10),
         height: parseInt(variables.dragged.getAttribute('height'), 10),
      };
   
      /* let collision to detect collide or not */
      let collision = false;
   
      variables.usingSvg.querySelectorAll('image').forEach(image => {
         if (image === variables.dragged) return;
         const propsOfImage = {
            x: parseInt(image.getAttribute('x'), 10),
            y: parseInt(image.getAttribute('y'), 10),
            width: parseInt(image.getAttribute('width'), 10),
            height: parseInt(image.getAttribute('height'), 10),
         };
   
         /* x y ratio */
         const xRatio = Math.abs(propsOfImage.x - propsOfDragged.x) / propsOfImage.width;
         const yRatio = Math.abs(propsOfImage.y - propsOfDragged.y) / propsOfImage.height;
   
         const yLimit = propsOfDragged.y >= propsOfImage.y - propsOfDragged.height && propsOfDragged.y <= propsOfImage.y + propsOfImage.height;
         const xLimit = propsOfDragged.x >= propsOfImage.x - propsOfDragged.width && propsOfDragged.x <= propsOfImage.x + propsOfImage.width;
   
         const leftLimit = propsOfImage.x - propsOfDragged.width <= propsOfDragged.x && propsOfImage.x - propsOfDragged.x >= 0;
         const rightLimit = propsOfDragged.x - propsOfImage.x <= propsOfImage.width && propsOfDragged.x - propsOfImage.x >= 0;
         const topLimit = propsOfImage.y - propsOfDragged.height <= propsOfDragged.y && propsOfImage.y - propsOfDragged.y >= 0;
         const bottomLimit = propsOfDragged.y - propsOfImage.y <= propsOfImage.height && propsOfDragged.y - propsOfImage.y >= 0;
   
         if (yRatio <= xRatio) {
            if (leftLimit && yLimit) {
               variables.dragged.setAttribute('x', propsOfImage.x - propsOfDragged.width - imageOutline * 2);
               variables.dragged.setAttribute('y', e.clientY - bounding.top - variables.dragged.getAttribute('height') / 2);
               variables.dragged.removeEventListener('mousemove', dragControllers.move);
               collision = true;
            }
         
            if (rightLimit && yLimit) {
               variables.dragged.setAttribute('x', propsOfImage.x + propsOfImage.width + imageOutline * 2);
               variables.dragged.setAttribute('y', e.clientY - bounding.top - variables.dragged.getAttribute('height') / 2);
               variables.dragged.removeEventListener('mousemove', dragControllers.move);
               collision = true;
            }
         }
   
         if (yRatio > xRatio) {
            if (topLimit && xLimit) {
               variables.dragged.setAttribute('x', e.clientX - bounding.left - variables.dragged.getAttribute('width') / 2);
               variables.dragged.setAttribute('y', propsOfImage.y - propsOfDragged.height - imageOutline * 2);
               variables.dragged.removeEventListener('mousemove', dragControllers.move);
               collision = true;
            }
         
            if (bottomLimit && xLimit) {
               variables.dragged.setAttribute('x', e.clientX - bounding.left - variables.dragged.getAttribute('width') / 2);
               variables.dragged.setAttribute('y', propsOfImage.y + propsOfImage.height + imageOutline * 2);
               variables.dragged.removeEventListener('mousemove', dragControllers.move);
               collision = true;
            } 
         }      
      })
   
      return collision;
   },
   drop: function() {
      document.removeEventListener('mousemove', dragControllers.move);
      document.removeEventListener('mouseup', dragControllers.drop);
   }
}

const styleDealers = {
   getStyle: function(element, attr) {
      if (element.currentStyle) {
         return element.currentStyle[attr];
      } else {
         return getComputedStyle(element, false)[attr];
      }
   },
   splitStyle: function(style, unit) {
      return parseInt(style.split(unit)[0], 10);
   }
};

function imgzoom(e) {
   const minSize = 16;

   let rolledWidth = parseInt(variables.rolled.getAttribute('width'));
   let rolledHeight = parseInt(variables.rolled.getAttribute('height'));

   rolledWidth += e.wheelDelta * 0.1;
   rolledHeight += e.wheelDelta * 0.1;

   if (rolledWidth < minSize) rolledWidth = minSize;
   if (rolledHeight < minSize) rolledHeight = minSize;

   variables.rolled.setAttribute('width', rolledWidth);
   variables.rolled.setAttribute('height', rolledHeight);
   return;
}

const deleteModeControllers = {
   toggleDeleteMode: function() {
      variables.deleteMode = !variables.deleteMode;
      document.querySelector('button#delete').classList.toggle('focus');
   },
   cancelDeleteMode: function() {
      variables.deleteMode = false;
      document.querySelector('button#delete').classList.remove('focus');
   }
}

function toggleDisableforButtons() {
   document.querySelectorAll('.button-container').forEach(container => {
      if (container === document.querySelector('#setting-button') || container === document.querySelector('#mode-button')) return;
      Array.from(container.children).forEach(button => {
         if (variables.deleteMode || !variables.editingMode) button.disabled = true;
         else button.disabled = false;
      });
   });
}

const editModeControllers = {
   readMode: function() {
      variables.editingMode = false;
      toggleDisableforButtons();
      const modeButton = document.querySelector('button#mode');
      modeButton.textContent = 'Read';
      modeButton.classList.add('read');
   },
   editMode: function() {
      variables.editingMode = true;
      toggleDisableforButtons();
      const modeButton = document.querySelector('button#mode');
      modeButton.textContent = 'Edit';
      modeButton.classList.remove('read');
   }
};


export { mainSvg, svgModels, svgViews, svgControllers, deleteModeControllers, toggleDisableforButtons, editModeControllers, variables }