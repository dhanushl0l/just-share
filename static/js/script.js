document.getElementById('justShare').addEventListener('click', function() {
  window.location.href = '/';
});

document.addEventListener('DOMContentLoaded', function() {
  var usernameInput = document.getElementById('username');
  var pinInput = document.getElementById('pin');

  usernameInput.addEventListener('input', function() {
      var value = usernameInput.value;

      // Convert to lowercase and remove non-lowercase English letters
      value = value.toLowerCase().replace(/[^a-z]/g, '');

      // Limit to 4 characters
      if (value.length > 4) {
          value = value.substring(0, 4);
      }

      usernameInput.value = value;
  });

  pinInput.addEventListener('input', function() {
      var value = pinInput.value;

      // Remove non-digit characters
      value = value.replace(/[^0-9]/g, '');

      // Limit to 4 characters
      if (value.length > 4) {
          value = value.substring(0, 4);
      }

      pinInput.value = value;
  });

  document.getElementById('receiveForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting the traditional way

      var isValid = true;

      if (!usernameInput.value.trim() || usernameInput.value.length < 4) {
          usernameInput.classList.add('shake');
          isValid = false;
      }

      if (!pinInput.value.trim() || pinInput.value.length < 4) {
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

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/receive', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.onload = function() {
          if (xhr.status === 200) {
              var response = JSON.parse(xhr.responseText);
              if (response.error_message) {
                  document.getElementById('errorvalue').textContent = response.error_message;
                  document.getElementById('outputContainer2').style.display = 'block';
                  document.getElementById('outputContainer3').style.display = 'none';
              } else if (response.message) {
                  document.getElementById('datavalue').textContent = response.message;
                  document.getElementById('outputContainer3').style.display = 'block';
                  document.getElementById('outputContainer2').style.display = 'none';
              }
          }
      };

      var username = usernameInput.value;
      var pin = pinInput.value;
      var params = 'username=' + encodeURIComponent(username) + '&pin=' + encodeURIComponent(pin);
      xhr.send(params);
  });
});

function copydata(element) {
  var text = document.getElementById('datavalue').textContent;
  navigator.clipboard.writeText(text).then(function() {
      element.querySelector('.copy-text').textContent = 'Copied!';
  }, function(err) {
      console.error('Could not copy text: ', err);
  });
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('sendForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting the traditional way

      var messageInput = document.getElementById('message');
      var isValid = true;

      if (!messageInput.value.trim()) {
          messageInput.classList.add('shake');
          isValid = false;
      }

      // Remove the shake class after the animation ends
      setTimeout(function() {
          messageInput.classList.remove('shake');
      }, 500); // Duration of the animation in milliseconds

      if (!isValid) {
          return; // If validation fails, do not proceed with the AJAX request
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/send', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.onload = function() {
          if (xhr.status === 200) {
              var response = JSON.parse(xhr.responseText);
              if (response.error_message) {
                  document.getElementById('errorvalue').textContent = response.error_message;
                  document.getElementById('outputContainer2').style.display = 'block';
                  document.getElementById('outputContainer3').style.display = 'none';
              } else if (response.username && response.pin && response.qr_code_link_text) {
                  document.getElementById('usernameValue').textContent = response.username;
                  document.getElementById('pinValue').textContent = response.pin;
                  document.getElementById('qrCodeImage').src = response.qr_code_link_text;
                  document.getElementById('outputContainer').style.display = 'block';
              }
          }
      };

      var message = messageInput.value;
      var params = 'message=' + encodeURIComponent(message);
      xhr.send(params);
  });
});


function hideContainer(containerId) {
  var container = document.getElementById(containerId);
  if (container) {
    container.style.display = 'none';
  }
}

document.getElementById('outputContainer2').querySelector('.close-1').addEventListener('click', function() {
  hideContainer('outputContainer2');
});

document.getElementById('outputContainer3').querySelector('.close-1').addEventListener('click', function() {
  hideContainer('outputContainer3');
});

document.getElementById('outputContainer').querySelector('.close').addEventListener('click', function() {
  hideContainer('outputContainer');
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

const text = document.querySelector('.message-out span');
if (text && text.textContent && text.textContent.length > 170) {
    text.style.fontSize = '1.8em';
} else if (text) {
    text.style.fontSize = '3em';
}

var messageSpan = document.querySelector('.message-out span');

if (messageSpan) {
    var messageText = messageSpan.textContent;
    var cleanedMessage = messageText.replace(/\‎ \s*/g, '\n');
    messageSpan.textContent = cleanedMessage;
}

