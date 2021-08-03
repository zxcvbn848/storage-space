const svgSrc = 'http://www.w3.org/2000/svg';
const variables = {
   svgSrc: 'http://www.w3.org/2000/svg',
   svgWidth: 1500,
   svgHeight: 650,
}

const roomModels = {
   roomData: null,
   createState: null,
   fetchGetRoom: function() {
      const src = '/api/setting/room';
      return fetch(src)
         .then(response => response.json())
         .then(result => this.roomData = result.data);
   },   
   fetchPostRoom: function() {
      const htmlId = document.querySelector('[data-subNav="room"]').querySelector('svg').id;
      const mainData = {
         html_id: htmlId,
      };

      const src = '/api/setting/room';
      return fetch(src, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "main_svg": mainData
            })
         })
         .then(response => response.json())
         .then(result => this.createState = result);
   },
};

const roomViews = {
   renderRoom: function() {
      if (roomModels.roomData) {
         const link = document.createElement('a');
         link.href = '/item-list';
         link.textContent = "Item-List";
         document.querySelector('[data-subNav="room"]').appendChild(link);

         const svg = document.createElementNS(variables.svgSrc, 'svg');
         svg.oncontextmenu = function() {
            return false;
         };
         svg.addEventListener('click', e => {
            parent.location.href = '/item-layout';
         });
         svg.setAttribute('width', variables.svgWidth);
         svg.setAttribute('height', variables.svgHeight);
         svg.id = roomModels.roomData.main_svg.html_id;

         const textObject = {        
            'x': svg.getAttribute('width') / 2.15, 
            'y': 50
         };
         const text = roomControllers.createSvgElement('text', textObject);
         text.textContent = 'Room';
         svg.appendChild(text);

         document.querySelector('[data-subNav="room"]').appendChild(svg);
         document.querySelector('#new-room').remove();

         this.renderMainItem(svg);
      } else {
         document.querySelector('#new-room').classList.remove('hidden');
      }
   },
   renderMainItem: function(roomSvg) {
      const mainItem = roomModels.roomData.main_svg.object_array;
      if (!mainItem) return;

      let width = roomSvg.getAttribute('width') / (mainItem.length + 1); 
      let x = roomSvg.getAttribute('width') / (mainItem.length + 1) - width / 2; 
      let y = 100;

      for (let object of mainItem) {
         const mainSvg = document.createElementNS(variables.svgSrc, 'svg');
         mainSvg.oncontextmenu = function() {
            return false;
         };
         mainSvg.setAttribute('x', x);
         mainSvg.setAttribute('width', width);
         mainSvg.setAttribute('height', roomSvg.getAttribute('height'));
         roomSvg.appendChild(mainSvg);

         const imageObject = {
            'x': mainSvg.getAttribute('width') / 2 - 25, 
            'y': y,
            'width': 50,
            'height': 50,
            'href': object.href,
         };

         const image = roomControllers.createSvgElement('image', imageObject);
         mainSvg.appendChild(image);

         if (object.data_layout) {
            this.renderSubItem(object, mainSvg, y);
         }
         x += width;
      }
   },
   renderSubItem: function(object, roomSvg, y) {
      y += 100;
      for (let svg of roomModels.roomData.sub_svg) {
         if (object.data_layout === svg.html_id) {
            if (!svg.object_array) continue;

            // x -= (roomSvg.getAttribute('width') / (svg.object_array.length + 1));
            let width = svg.object_array.length > 1 ? roomSvg.getAttribute('width') / (svg.object_array.length - 1) : roomSvg.getAttribute('width');
            let x = roomSvg.getAttribute('width') / (svg.object_array.length + 1) - width / 2;
            if (x < 0) {
               x = 0;
            }

            for (let subObject of svg.object_array) {
               const subSvg = document.createElementNS(variables.svgSrc, 'svg');
               subSvg.oncontextmenu = function() {
                  return false;
               };
               subSvg.setAttribute('x', x);
               subSvg.setAttribute('width', width);
               subSvg.setAttribute('height', roomSvg.getAttribute('height'));
               roomSvg.appendChild(subSvg);

               const imageObject = {
                  'x': svg.object_array.length === 1 ? roomSvg.getAttribute('width') / 4 : subSvg.getAttribute('width') / (svg.object_array.length + 1), 
                  'y': y,
                  'width': 50,
                  'height': 50,
                  'href': subObject.href,
               };
      
               const image = roomControllers.createSvgElement('image', imageObject);
               subSvg.appendChild(image);
               /* 2nd ~ layer (place to item) */
               x += (roomSvg.getAttribute('width') / (svg.object_array.length + 1));
               
               if (subObject.data_layout) {
                  this.renderSubItem(subObject, subSvg, y);
               }
            }
         }
      }
   }
};

const roomControllers = {
   createSvgElement: function(tagName, attrs) {
      const element = document.createElementNS(variables.svgSrc, tagName);
      for (let name in attrs) {
         element.setAttribute(name, attrs[name]);
      }
      return element;      
   },
   showRoom: function() {
      roomModels.fetchGetRoom()
         .then(() => roomViews.renderRoom())
         .then(() => roomModels.roomData = null)
         .catch(error => console.log(error));
   },
   createNewRoom: function() {
      const link = document.createElement('a');
      link.href = '/item-list';
      link.textContent = "Item-List";
      document.querySelector('[data-subNav="room"]').appendChild(link);

      const svg = document.createElementNS(variables.svgSrc, 'svg');
      svg.oncontextmenu = function() {
         return false;
      };
      svg.addEventListener('click', e => {
         parent.location.href = '/item-layout';
      });
      svg.setAttribute('width', variables.svgWidth);
      svg.setAttribute('height', variables.svgHeight);
      svg.id = "main-svg";
      
      const textObject = {        
         'x': svg.getAttribute('width') / 2.5, 
         'y': svg.getAttribute('height') / 2
      };
      const text = roomControllers.createSvgElement('text', textObject);
      text.textContent = 'Click to Edit';
      svg.appendChild(text);
   
      document.querySelector('[data-subNav="room"]').appendChild(svg);
   
      document.querySelector('#new-room').remove();
   }
};

window.addEventListener('load', e => {
   roomControllers.showRoom();
})

document.querySelector('[data-subNav="room"]').querySelectorAll('svg').forEach(svg => {
   svg.addEventListener('click', e => {
      parent.location.href = '/item-layout';
   });
})

document.querySelector('#new-room').addEventListener('click', e => {
   e.preventDefault();
   roomControllers.createNewRoom();
   roomModels.fetchPostRoom()
      .then(() => alert(roomModels.createState.message))
      .catch(error => console.log(error));
})