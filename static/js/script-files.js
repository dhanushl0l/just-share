document.getElementById('justShare').addEventListener('click', function() {
    window.location.href = '/';
});

document.getElementById('about-button').addEventListener('click', function() {
    window.location.href = '/about';
  });

document.addEventListener('DOMContentLoaded', function() {
    var usernameInput = document.getElementById('username');
    var pinInput = document.getElementById('pin-1');
    var outputContainer = document.getElementById('outputContainer2');

    if (usernameInput && pinInput && outputContainer) {
        usernameInput.addEventListener('input', function() {
            // Your username input handling code here
        });

        pinInput.addEventListener('input', function() {
            var numericValue = pinInput.value.replace(/\D/g, ''); // Remove non-numeric characters
            pinInput.value = numericValue;
        });

        document.getElementById('receiveForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way

            var isValid = true;

            if (!usernameInput.value.trim() || usernameInput.value.length < 4) {
                usernameInput.classList.add('shake');
                isValid = false;
            }

            if (!pinInput.value.trim() || pinInput.value.length < 4 || !/^\d+$/.test(pinInput.value)) {
                pinInput.classList.add('shake');
                isValid = false;
            }

            // Remove the shake class after the animation ends
            setTimeout(function() {
                usernameInput.classList.remove('shake');
                pinInput.classList.remove('shake');
            }, 500); // Duration of the animation in milliseconds

            if (!isValid) {
                return; // If validation fails, do not proceed with the AJAX request
            }

            // Perform AJAX request
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/download?pin=' + pinInput.value + '&folder_name=' + usernameInput.value);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var contentType = xhr.getResponseHeader('Content-Type');
                    if (contentType && contentType.toLowerCase().includes('json')) {
                        // Handle JSON response
                        try {
                            var response = JSON.parse(xhr.responseText);
                            if (response.error) {
                                outputContainer.style.display = 'block';
                                document.getElementById('errorvalue').textContent = response.error;
                            } else {
                                // Handle successful JSON response
                                var downloadLink = document.createElement('a');
                                downloadLink.href = '/download?pin=' + pinInput.value + '&folder_name=' + usernameInput.value;
                                downloadLink.click();
                            }
                        } catch (e) {
                            // Handle JSON parsing error by showing an error message
                            outputContainer.style.display = 'block';
                            document.getElementById('errorvalue').textContent = 'An error occurred while processing the response.';
                        }
                    } else {
                        // Handle file download for non-JSON responses
                        var downloadLink = document.createElement('a');
                        downloadLink.href = '/download?pin=' + pinInput.value + '&folder_name=' + usernameInput.value;
                        downloadLink.click();
                    }
                } else {
                    console.error('Request failed. Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        });
    }
});


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
            qrCodeImg.src = response.qr_code_link_files;
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
        qrCodeImg.src = data.qr_code_link_files;
        qrCodeImg.onload = function() {
            // Once the image is loaded, display it
            qrCodeImg.style.display = 'block';
        };
    });
}

function share() {
    const pinValue = document.getElementById('pinValue').innerText;
    const usernameValue = document.getElementById('usernameValue').innerText;
    const UserName = usernameValue;
    const pin = pinValue;
    const shareUrl = `https://justshare.cloud/download/${UserName}/${pin}`;
    copyToClipboard(shareUrl);

    const shareButton = document.querySelector('.share-link');
    const originalText = shareButton.innerText;
    shareButton.innerText = 'Copied!';
    setTimeout(() => {
        shareButton.innerText = originalText;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const pinInput = document.getElementById("pin-1");
    const submitButton = document.querySelector(".update-button");

    function handleInput(e) {
        const target = e.target;

        if (target.value.length >= target.maxLength && target === usernameInput) {
            pinInput.focus();  
        }
    }

    function handleKeyPress(e) {
        if (e.target === usernameInput && e.key !== "Backspace" && usernameInput.value.length >= usernameInput.maxLength) {
            pinInput.focus(); 
        }
        if (e.target === pinInput && e.key === "Enter") {
            submitButton.click();  
        }
    }

    usernameInput.addEventListener("input", handleInput);
    pinInput.addEventListener("input", handleInput);
    usernameInput.addEventListener("keypress", handleKeyPress);
    pinInput.addEventListener("keypress", handleKeyPress);
});

document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");

    function handleGlobalKeyDown(e) {
        const activeElement = document.activeElement;
        const isPrintableKey = e.key.length === 1 && e.key.match(/[a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/); // Letters and symbols only
        const isPaste = (e.ctrlKey || e.metaKey) && e.key === 'v';

        if (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA") {
            if (usernameInput.value.length < 4) {
                usernameInput.focus();

                if (isPrintableKey) {
                    e.preventDefault();
                    usernameInput.value += e.key.toLowerCase(); 
                } else if (isPaste) {
                    e.preventDefault();
                    navigator.clipboard.readText().then((clipText) => {
                        const filteredText = clipText.toLowerCase().replace(/[0-9]/g, ''); 
                        const newText = filteredText.slice(0, 4 - usernameInput.value.length); 
                        usernameInput.value += newText;
                    });
                }
            } else {
                usernameInput.focus(); 
            }
        }
    }

    document.addEventListener("keydown", handleGlobalKeyDown);
});


function handleFileInput(e) {
    e.preventDefault(); 

    if (e.type === 'drop') {
        const fileInput = document.getElementById('fileInput');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files; 
            updateFileName(); 
        }
    }

    if (e.clipboardData && e.clipboardData.items) {
        const fileInput = document.getElementById('fileInput');
        for (let i = 0; i < e.clipboardData.items.length; i++) {
            const item = e.clipboardData.items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                fileInput.files = new DataTransfer().files; // Clear any existing files
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files; // Set the file input to the pasted file
                updateFileName(); // Call the updateFileName function
            }
        }
    }
}

// Add event listeners for drag-and-drop and paste
document.querySelector('.content-s').addEventListener('dragover', function(e) {
    e.preventDefault(); // Allow drop
});
document.querySelector('.content-s').addEventListener('drop', handleFileInput);
document.addEventListener('paste', handleFileInput);
