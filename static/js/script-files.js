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
            
        });

        pinInput.addEventListener('input', function() {
            var numericValue = pinInput.value.replace(/\D/g, ''); 
            pinInput.value = numericValue;
        });

        document.getElementById('receiveForm').addEventListener('submit', function(event) {
            event.preventDefault(); 

            var isValid = true;

            if (!usernameInput.value.trim() || usernameInput.value.length < 4) {
                usernameInput.classList.add('shake');
                isValid = false;
            }

            if (!pinInput.value.trim() || pinInput.value.length < 4 || !/^\d+$/.test(pinInput.value)) {
                pinInput.classList.add('shake');
                isValid = false;
            }

            
            setTimeout(function() {
                usernameInput.classList.remove('shake');
                pinInput.classList.remove('shake');
            }, 500); 

            if (!isValid) {
                return; 
            }

            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/download?pin=' + pinInput.value + '&folder_name=' + usernameInput.value);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var contentType = xhr.getResponseHeader('Content-Type');
                    if (contentType && contentType.toLowerCase().includes('json')) {
                        
                        try {
                            var response = JSON.parse(xhr.responseText);
                            if (response.error) {
                                outputContainer.style.display = 'block';
                                document.getElementById('errorvalue').textContent = response.error;
                            } else {
                                
                                var downloadLink = document.createElement('a');
                                downloadLink.href = '/download?pin=' + pinInput.value + '&folder_name=' + usernameInput.value;
                                downloadLink.click();
                            }
                        } catch (e) {
                            
                            outputContainer.style.display = 'block';
                            document.getElementById('errorvalue').textContent = 'An error occurred while processing the response.';
                        }
                    } else {
                        
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

  
  const textarea = document.createElement('textarea');
  
  textarea.value = datavalue;

  
  document.body.appendChild(textarea);

  
  textarea.select();
  
  document.execCommand('copy');

  
  document.body.removeChild(textarea);

  
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
        const fileSize = fileInput.files[0].size; 
        const maxSize = 11 * 1024 * 1024; 

        if (fileSize > maxSize) {
            popup.style.display = 'block';
            fileInput.value = ''; 

        } else {
          fileLabel.innerHTML = `<img class="fileLabel" src="/static/assets/update yes.svg"><img src="/static/assets/update out.svg" class="fileLabel-1"  alt="Upload File"><span class="fileLabelText">${fileInput.files[0].name}</span>`;
            popup.style.display = 'none'; 
        }
    }
}



function closePopup(containerId) {
    
    document.getElementById('uploadProgress').value = 0;

    
    document.getElementById('fileInput').value = '';

    
    document.getElementById('fileLabel').innerHTML = `<img class="fileLabel" src="/static/assets/update up.svg"><img src="/static/assets/update out.svg" class="fileLabel-1"  alt="Upload File"><span class="fileLabelText">Select a file...</span>`;

    
    document.getElementById('progressBarContainer').style.display = 'block';


    
    document.getElementById(containerId).style.display = 'none';
}



document.getElementById('fileInput').addEventListener('change', function() {
    document.getElementById('uploadProgress').value = 0;
    document.getElementById('progressBar').style.width = '0%';
});


document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);

    
    if (formData.get('file').name === '') {
        return; 
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
        console.log(xhr.responseText); 
        if (xhr.status == 200) {
            
            var response = JSON.parse(xhr.responseText);
            document.getElementById('folderName').value = response.username;
            document.getElementById('pin').value = response.pin;
            document.getElementById('progressBarContainer').style.display = 'none';

            
            document.getElementById('usernameValue').innerText = response.username;
            document.getElementById('pinValue').innerText = response.pin;

            
            document.getElementById('outputContainer').style.display = 'block';

            
            var qrCodeImg = document.getElementById('qrCodeImg');
            qrCodeImg.src = response.qr_code_link_files;
            qrCodeImg.onload = function() {
                
                qrCodeImg.style.display = 'block';
            };
        } else {
            
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
    fileLabel.classList.add('shake'); 
    setTimeout(function() {
      fileLabel.classList.remove('shake'); 
    }, 400);
    event.preventDefault(); 
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

        
        var qrCodeImg = document.getElementById('qrCodeImg');
        qrCodeImg.src = data.qr_code_link_files;
        qrCodeImg.onload = function() {
            
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
    const submitButton = document.querySelector(".click");

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
        const isPrintableKey = e.key.length === 1 && e.key.match(/[a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/); 
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
                fileInput.files = new DataTransfer().files; 
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files; 
                updateFileName(); 
            }
        }
    }
}

document.querySelector('.content-s').addEventListener('dragover', function(e) {
    e.preventDefault(); 
});
document.querySelector('.content-s').addEventListener('drop', handleFileInput);
document.addEventListener('paste', handleFileInput);
