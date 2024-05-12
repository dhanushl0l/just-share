document.getElementById('justShare').addEventListener('click', function() {
  window.location.href = 'https://justshare.dhanush.online/';
});

function closePopup(containerId) {
var container = document.getElementById(containerId);
container.style.display = "none";
}

function closePopup(elementId) {
  document.getElementById(elementId).style.display = 'none';
  window.location.href = '/';
}

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
if (text.textContent.length > 170) {
text.style.fontSize = '1.8em';
} else {
text.style.fontSize = '3em';
}

var messageSpan = document.querySelector('.message-out span');

var messageText = messageSpan.textContent;

var cleanedMessage = messageText.replace(/\‎ \s*/g, '\n');

messageSpan.textContent = cleanedMessage;

   