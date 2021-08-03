const capitalize = word => word && word[0].toUpperCase() + word.slice(1);

const listModels = {
   listData: null,
   searchData: null, 
   srcDetermine: function(keyword) {
      if (keyword) return `/api/layout?keyword=${keyword}`;
      return null;
   },
   fetchGetLayouts: function() {
      const src = '/api/layouts';
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            this.listData = result.data;
         });
   },
   fetchGetLayoutByKeyword: function(src) {
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            console.log(result.data);
            this.searchData = result.data;
         });
   }
};

const listViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   renderList: function() {
      const layerContainer = document.querySelector('.layer-container');
      
      if (!listModels.listData) {
         const noItem = document.createElement('div');
         noItem.textContent = 'No Item';
         noItem.classList.add('layer');
         layerContainer.appendChild(noItem);
         return;
      }

      console.log(listModels.listData);
      
      this.removeAllChildNodes(layerContainer);

      if (!listModels.listData.main_svg.object_array) return;

      for (let object of listModels.listData.main_svg.object_array) {
         const layout = document.createElement('div');
         layout.classList.add('layer');
         layerContainer.appendChild(layout);

         const buttonArea = document.createElement('div');
         buttonArea.classList.add('button-area');
         layout.appendChild(buttonArea);

         const button = document.createElement('button');
         button.id = object.name;
         const label = document.createElement('label')
         label.classList.add('layer-name');
         label.htmlFor = object.name;
         const img = document.createElement('img');
         img.src = object.href;
         label.textContent = capitalize(object.name).replace('%20', ' ');
         buttonArea.appendChild(button);
         buttonArea.appendChild(label);
         buttonArea.appendChild(img);

         if (!listModels.listData.sub_svg) continue;

         /* 1st layer (room to place) */
         for (let svg of listModels.listData.sub_svg) {
            if (object.data_layout === svg.html_id) {
               const itemList = document.createElement('ul');
               layout.appendChild(itemList);

               if (!svg.object_array) continue;

               for (let subObject of svg.object_array) {
                  const item = document.createElement('li');
                  itemList.appendChild(item);
                  /* 2nd ~ layer (place to item) */
                  this.layerRecursion(item, subObject);
               }
            }
         }
      }
   },
   layerRecursion: function(item, subObject) {
      if (subObject.data_layout) {
         for (let subSvg of listModels.listData.sub_svg) {
            if (subObject.data_layout === subSvg.html_id) {
               const buttonArea = document.createElement('div');
               buttonArea.classList.add('button-area');
               item.appendChild(buttonArea);
      
               const button = document.createElement('button');
               button.id = subObject.name;
               const label = document.createElement('label')
               label.classList.add('layer-name');
               label.htmlFor = subObject.name;
               label.textContent = capitalize(subObject.name).replace('%20', ' ');
               const img = document.createElement('img');
               img.src = subObject.href;
               buttonArea.appendChild(button);
               buttonArea.appendChild(label);
               buttonArea.appendChild(img);
               item.appendChild(buttonArea);
               
               /* object in subSvg */
               const subitemList = document.createElement('ul');
               item.appendChild(subitemList);

               for (let subSubObject of subSvg.object_array) {
                  const subItem = document.createElement('li');
                  this.layerRecursion(subItem, subSubObject);
                  subitemList.appendChild(subItem);
               }
            }
         }
      } else {
         item.textContent = subObject.name.replace('%20', ' ');
         const img = document.createElement('img');
         img.src = subObject.href;
         item.appendChild(img);
      }
   },
   renderSearchList: function() {
      const layerContainer = document.querySelector('.layer-container');
      
      if (!listModels.searchData) {
         const noItem = document.createElement('div');
         noItem.textContent = 'No Item';
         noItem.classList.add('layer');
         layerContainer.appendChild(noItem);
         return;
      }

      console.log(listModels.searchData);
      
      this.removeAllChildNodes(layerContainer);

      for (let object of listModels.searchData.main_svg.object_array) {
         const layout = document.createElement('div');
         layout.classList.add('layer');
         layerContainer.appendChild(layout);

         const buttonArea = document.createElement('div');
         buttonArea.classList.add('button-area');
         layout.appendChild(buttonArea);

         const button = document.createElement('button');
         button.id = object.name;
         const label = document.createElement('label')
         label.classList.add('layer-name');
         label.htmlFor = object.name;
         const img = document.createElement('img');
         img.src = object.href;
         label.textContent = capitalize(object.name).replace('%20', ' ');
         buttonArea.appendChild(button);
         buttonArea.appendChild(label);
         buttonArea.appendChild(img);

         if (!listModels.searchData.sub_svg) continue;

         /* 1st layer (room to place) */
         for (let svg of listModels.searchData.sub_svg) {
            if (object.data_layout === svg.html_id) {
               const itemList = document.createElement('ul');
               layout.appendChild(itemList);

               if (!svg.object_array) continue;

               for (let subObject of svg.object_array) {
                  const item = document.createElement('li');
                  itemList.appendChild(item);
                  /* 2nd ~ layer (place to item) */
                  this.layerRecursion(item, subObject);
               }
            }
         }
      }
   }
};

const listControllers = {
   showList: function() {
      listModels.fetchGetLayouts()
         .then(() => listViews.renderList())
         .then(() => listModels.listData = null)
         .catch(error => console.log(error));
   },
   searchList: function() {
      const keyword = document.getElementsByName('keyword')[0].value;
      const src = listModels.srcDetermine(keyword);

      if (src) {
         listModels.fetchGetLayoutByKeyword(src)
            .then(() => {
               listViews.renderSearchList();
            });
      } else {
         this.showList();
      }
   }
};

listControllers.showList();

// TBD: Search Item
// document.querySelector('#search-form').addEventListener('submit', e => {
//    e.preventDefault();
//    listControllers.searchList();
// });
