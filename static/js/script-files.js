var images = ['/static/assets/update up.svg', '/static/assets/update out.svg', '/static/assets/update yes.svg'];
var index = 0;

function loadNextImage() {
    if (index < images.length) {
        var img = new Image();
        img.onload = function() {
            index++;
            loadNextImage();
        };
        img.src = images[index];
    }
}

loadNextImage();
  
document.getElementById('justShare').addEventListener('click', function() {
    window.location.href = 'https://justshare.dhanush.online/';
});


function copydata(link) {
  const datavalue = document.getElementById('datavalue').textContent;

  // Create a new textarea element
  const textarea = document.createElement('textarea');
  // Set the value of the textarea to the text content of the span element
  textarea.value = datavalue;

  // Append the textarea to the document body
  document.body.appendChild(textarea);

  // Select the text inside the textarea
  textarea.select();
  // Copy the selected text to the clipboard
  document.execCommand('copy');

  // Remove the textarea from the document body
  document.body.removeChild(textarea);

  // Change the icon
  changeIcon(link);
}


function copyUsername(link) {
  const usernameValue = document.getElementById('usernameValue').innerText;
  copyToClipboard(usernameValue);
  changeIcon(link);
}

function copyPin(link) {
  const pinValue = document.getElementById('pinValue').innerText;
  copyToClipboard(pinValue);
  changeIcon(link);
}

function copyToClipboard(value) {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  tempInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}

function changeIcon(link) {
  link.querySelector('img').src = '/static/assets/check.png'; 
  link.querySelector('.copy-text').style.display = 'block'; 
  setTimeout(() => {
    link.querySelector('img').src = '/static/assets/clipboard.png'; 
    link.querySelector('.copy-text').style.display = 'none'; 
  }, 1000); 
}

document.addEventListener('DOMContentLoaded', function() {
  var closeButton = document.querySelector('.close-1');
  var outputContainer = document.querySelector('#outputContainer2');

  closeButton.addEventListener('click', function() {
    outputContainer.style.display = 'none';
    document.getElementById("uploadProgress").value = 0;

    var fileInput = document.getElementById("fileInput");
    var fileLabel = document.getElementById("fileLabel");
    fileLabel.innerHTML = `<img class="fileLabel" src="/static/assets/update up.svg"><img src="/static/assets/update out.svg" class="fileLabel-1" alt="Upload File"><span class="fileLabelText">Select a file...</span>`;

    fileInput.value = '';
  });
});


function convertToLowercase(input) {
    input.value = input.value.toLowerCase().replace(/[^a-z]/g, '');
  }

function updateFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popupText');

    if (fileInput.files.length > 0) {
        const fileSize = fileInput.files[0].size; // Size in bytes
        const maxSize = 11 * 1024 * 1024; // 10 MB in bytes

        if (fileSize > maxSize) {
            popup.style.display = 'block';
            fileInput.value = ''; // Clear the selected file

        } else {
          fileLabel.innerHTML = `<img class="fileLabel" src="/static/assets/update yes.svg"><img src="/static/assets/update out.svg" class="fileLabel-1"  alt="Upload File"><span class="fileLabelText">${fileInput.files[0].name}</span>`;
            popup.style.display = 'none'; // Hide the popup if no error
        }
    }
}


// Function to close the popup
function closePopup(containerId) {
    // Reset progress bar
    document.getElementById('uploadProgress').value = 0;

    // Remove selected file
    document.getElementById('fileInput').value = '';

    // Reset fileLabel HTML content
    document.getElementById('fileLabel').innerHTML = `<img class="fileLabel" src="/static/assets/update up.svg"><img src="/static/assets/update out.svg" class="fileLabel-1"  alt="Upload File"><span class="fileLabelText">Select a file...</span>`;

    // Reset progressBarContainer class
    document.getElementById('progressBarContainer').style.display = 'block';


    // Hide the popup
    document.getElementById(containerId).style.display = 'none';
}


// Reset the progress bar when a new file is selected
document.getElementById('fileInput').addEventListener('change', function() {
    document.getElementById('uploadProgress').value = 0;
    document.getElementById('progressBar').style.width = '0%';
});

// Submit the form and handle file upload
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);

    // Check if a file is selected
    if (formData.get('file').name === '') {
        return; // Exit the function
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            var percentage = (e.loaded / e.total) * 100;
            document.getElementById('uploadProgress').value = percentage;
            document.getElementById('progressBar').style.width = percentage + '%';
        }
    };

    xhr.onload = function() {
        console.log(xhr.responseText); // Log the response for debugging
        if (xhr.status == 200) {
            // Upload successful
            var response = JSON.parse(xhr.responseText);
            document.getElementById('folderName').value = response.username;
            document.getElementById('pin').value = response.pin;
            document.getElementById('progressBarContainer').style.display = 'none';

            // Update the username and pin values in the output container
            document.getElementById('usernameValue').innerText = response.username;
            document.getElementById('pinValue').innerText = response.pin;

            // Show the output container
            document.getElementById('outputContainer').style.display = 'block';

            // Load the QR code image
            var qrCodeImg = document.getElementById('qrCodeImg');
            qrCodeImg.src = response.qr_code_link;
            qrCodeImg.onload = function() {
                // Once the image is loaded, display it
                qrCodeImg.style.display = 'block';
            };
        } else {
            // Upload failed
            alert('Upload failed. Please try again.');
        }
    };

  xhr.send(formData);

  document.getElementById('progressBarContainer').style.display = 'block';
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
  var fileInput = document.getElementById('fileInput');
  var fileLabel = document.getElementById('fileLabel');
  if (fileInput.files.length === 0) {
    fileLabel.classList.add('shake'); // Add the shake class
    setTimeout(function() {
      fileLabel.classList.remove('shake'); // Remove the shake class after the animation ends
    }, 400);
    event.preventDefault(); // Prevent the form from being submitted
    return;
  }
});

function showOutputContainer() {
    var outputContainer = document.getElementById('outputContainer');
    outputContainer.style.display = 'block';

    fetch('/upload', {
        method: 'POST',
        body: new FormData(document.getElementById('uploadForm')),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('usernameValue').textContent = data.username;
        document.getElementById('pinValue').textContent = data.pin;

        // Set the QR code link as the src of the image
        var qrCodeImg = document.getElementById('qrCodeImg');
        qrCodeImg.src = data.qr_code_link;
        qrCodeImg.onload = function() {
            // Once the image is loaded, display it
            qrCodeImg.style.display = 'block';
        };
    });
}