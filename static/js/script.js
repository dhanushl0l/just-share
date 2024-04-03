const username = "{{ username }}";
const pin = "{{ pin }}";
const error = "{{ error }}";
const message = "{{ message }}";

const outputContainer = document.getElementById('outputContainer');
const outputContainer2 = document.getElementById('outputContainer2');
const usernameValue = document.getElementById('usernameValue');
const pinValue = document.getElementById('pinValue');

if (username && pin) {
    outputContainer.style.display = 'block';
    usernameValue.textContent = username;
    pinValue.textContent = pin;
} else {
    outputContainer.style.display = 'none';
}

if (error) {
    outputContainer2.style.display = 'block';
} else {
    outputContainer2.style.display = 'none';
}

if (message) {
    outputContainer3.style.display = 'block';
} else {
    outputContainer3.style.display = 'none';
}

function closePopup(containerId) {
  var container = document.getElementById(containerId);
  container.style.display = "none";
}

function closePopup(elementId) {
    document.getElementById(elementId).style.display = 'none';
    window.location.href = '/';
}

function copydata(link) {
  const datavalue = document.getElementById('datavalue').innerText;
  copyToClipboard(datavalue);
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
if (text && text.textContent.length > 170) { 
    text.style.fontSize = '1.8em';
} else if (text) {
    text.style.fontSize = '3em';
}
