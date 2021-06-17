// upload form
const uploadForm = document.getElementById('upload-form');
// main
const mainElement = document.querySelector('main');

// indexModels
let indexModels = {
   uploadData: {},
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

// indexViews
let indexViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   render: function() {
      const resultArea = document.createElement('div')
      resultArea.classList.add('result-area');

      this.createLoadingElement(resultArea);

      mainElement.appendChild(resultArea);

      return resultArea;
   },
   showData: function(resultArea) {
      const textElement = document.createElement('div');
      textElement.classList.add('text')
      textElement.textContent = indexModels.uploadData['text'];

      const imageElement = document.createElement('div');
      imageElement.classList.add('image');
      const img = document.createElement('img');
      img.src = indexModels.uploadData['image_url'];
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
   }
};

// indexControllers
let indexControllers = {
   upload: function() {
      const resultArea = indexViews.render();

      indexModels.fetchPostUploadAPI()
         .then(() => indexViews.showData(resultArea))
         .then(() => indexModels.uploadData = {})
         .catch(err => console.log(err));
   }
};

uploadForm.addEventListener('submit', e => {
   e.preventDefault();

   indexControllers.upload();
});