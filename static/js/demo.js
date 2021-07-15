import {} from './signin-confirm.js';

// upload form
const uploadForm = document.getElementById('upload-form');
// main
const mainElement = document.querySelector('main');
// goTop & goBottom
const goTop = document.querySelector('#goTop'); 
const goBottom = document.querySelector('#goBottom'); 

// indexModels
/* let indexModels = {
   uploadDataArray: null,
   uploadData: null,
   fetchGetUploadAPI: function() {
      const text = uploadForm.querySelector('#uploadText').value;

      const src = '/api/upload';

      const postUploadForm = new FormData();
      postUploadForm.append('text', text);
      postUploadForm.append('image', uploadForm.querySelector('#uploadImage').files[0]);

      return fetch(src)
         .then(response => response.json())
         .then(result => this.uploadDataArray = result.data);
   },
   fetchPostUploadAPI: function() {
      const text = uploadForm.querySelector('#uploadText').value;

      const src = '/api/upload';

      const postUploadForm = new FormData();
      postUploadForm.append('text', text);
      postUploadForm.append('image', uploadForm.querySelector('#uploadImage').files[0]);

      return fetch(src, {
         method: 'POST',
         body: postUploadForm
      })
         .then(response => response.json())
         .then(result => this.uploadData = result.data);
   }
};
 */
// indexViews
/* let indexViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   renderAll: function() {
      if (!indexModels.uploadDataArray) return;

      for (let upload of indexModels.uploadDataArray) {
         const resultArea = document.createElement('div')
         resultArea.classList.add('result-area');
   
         this.createLoadingElement(resultArea);
         this.showData(resultArea, upload);
   
         mainElement.appendChild(resultArea);
      }
   },
   showData: function(resultArea, upload) {
      const textElement = document.createElement('div');
      textElement.classList.add('text')
      textElement.textContent = upload['text'];

      const imageElement = document.createElement('div');
      imageElement.classList.add('image');
      const img = document.createElement('img');
      img.src = upload['image_url'];
      img.onload = function() {
         resultArea.removeChild(resultArea.querySelector('.spinner'));
      };

      imageElement.appendChild(img);

      resultArea.appendChild(textElement);
      resultArea.appendChild(imageElement);
   },
   createLoadingElement: function(element) {
      const spinner = document.createElement('div');
      spinner.classList.add('spinner');

      const spinnerText = document.createElement('div');
      spinnerText.classList.add('spinner-text');
      spinnerText.innerText = 'Loading';

      const spinnerSectorRed = document.createElement('div');
      spinnerSectorRed.classList.add('spinner-sector');
      spinnerSectorRed.classList.add('spinner-sector-red');

      const spinnerSectorBlue = document.createElement('div');
      spinnerSectorBlue.classList.add('spinner-sector');
      spinnerSectorBlue.classList.add('spinner-sector-blue');

      const spinnerSectorGreen = document.createElement('div');
      spinnerSectorGreen.classList.add('spinner-sector');
      spinnerSectorGreen.classList.add('spinner-sector-green');

      spinner.appendChild(spinnerText);
      spinner.appendChild(spinnerSectorRed);
      spinner.appendChild(spinnerSectorBlue);
      spinner.appendChild(spinnerSectorGreen);
      element.appendChild(spinner);
   },
   renderOne: function() {
      const resultArea = document.createElement('div')
      resultArea.classList.add('result-area');

      this.createLoadingElement(resultArea);

      mainElement.appendChild(resultArea);

      return resultArea;
   },
   uploadPost: function(resultArea) {
      const upload = indexModels.uploadData;

      const textElement = document.createElement('div');
      textElement.classList.add('text')
      textElement.textContent = upload['text'];

      const imageElement = document.createElement('div');
      imageElement.classList.add('image');
      const img = document.createElement('img');
      img.src = upload['image_url'];
      img.onload = function() {
         resultArea.removeChild(resultArea.querySelector('.spinner'));
      };

      imageElement.appendChild(img);

      resultArea.appendChild(textElement);
      resultArea.appendChild(imageElement);
   }
}; */

// indexControllers
let indexControllers = {
/*    init: function() {
      indexModels.fetchGetUploadAPI()
         .then(() => indexViews.renderAll())
         .then(() => indexModels.uploadDataArray = null)
         .catch(err => console.log(err));
   },
   upload: function() {
      const resultArea = indexViews.renderOne();

      window.scrollTo(0, document.body.scrollHeight);

      indexModels.fetchPostUploadAPI()
         .then(() => indexViews.uploadPost(resultArea))
         .then(() => indexModels.uploadData = null)
         .catch(err => console.log(err));
   }, */
   goTop: function() {
      window.scrollTo(0, 0);
   },
   goBottom: function() {
      window.scrollTo(0, document.body.scrollHeight);
   },
};

/* indexControllers.init();

uploadForm.addEventListener('submit', e => {
   e.preventDefault();

   indexControllers.upload();
}); */

goTop.addEventListener('click', e => {
   e.preventDefault();

   indexControllers.goTop();
});
goBottom.addEventListener('click', e => {
   e.preventDefault();

   indexControllers.goBottom();
});