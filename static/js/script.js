document.getElementById('justShare').addEventListener('click', function() {
  window.location.href = '/';
});

document.getElementById('about-button').addEventListener('click', function() {
    window.location.href = '/about';
  });

document.addEventListener('DOMContentLoaded', function() {
  var usernameInput = document.getElementById('username');
  var pinInput = document.getElementById('pin');

  usernameInput.addEventListener('input', function() {
      var value = usernameInput.value;

      
      value = value.toLowerCase().replace(/[^a-z]/g, '');

      
      if (value.length > 4) {
          value = value.substring(0, 4);
      }

      usernameInput.value = value;
  });

  pinInput.addEventListener('input', function() {
      var value = pinInput.value;

      
      value = value.replace(/[^0-9]/g, '');

      
      if (value.length > 4) {
          value = value.substring(0, 4);
      }

      pinInput.value = value;
  });

  document.getElementById('receiveForm').addEventListener('submit', function(event) {
      event.preventDefault(); 

      var isValid = true;

      if (!usernameInput.value.trim() || usernameInput.value.length < 4) {
          usernameInput.classList.add('shake');
          isValid = false;
      }

      if (!pinInput.value.trim() || pinInput.value.length < 4) {
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
      event.preventDefault(); 

      var messageInput = document.getElementById('message');
      var isValid = true;

      if (!messageInput.value.trim()) {
          messageInput.classList.add('shake');
          isValid = false;
      }

      
      setTimeout(function() {
          messageInput.classList.remove('shake');
      }, 500); 

      if (!isValid) {
          return; 
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

function share() {
    const pinValue = document.getElementById('pinValue').innerText;
    const usernameValue = document.getElementById('usernameValue').innerText;
    const UserName = usernameValue;
    const pin = pinValue;
    const shareUrl = `https://justshare.cloud/receive/${UserName}/${pin}`;
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
    const pinInput = document.getElementById("pin");
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
    const messageTextarea = document.getElementById("message");

    function handleGlobalKeyDown(e) {
        const activeElement = document.activeElement;
        const isPrintableKey = e.key.length === 1;
        const isPaste = (e.ctrlKey || e.metaKey) && e.key === 'v';

        if (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA") {
            messageTextarea.focus();

            if (isPrintableKey) {
                e.preventDefault(); 
                messageTextarea.value += e.key; 
            } else if (isPaste) {
                e.preventDefault(); 
                navigator.clipboard.readText().then((clipText) => {
                    messageTextarea.value += clipText; 
                });
            }
        }
    }

    document.addEventListener("keydown", handleGlobalKeyDown);
});
