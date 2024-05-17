from flask import Flask, render_template, request, send_from_directory, jsonify, redirect, url_for, session
from flask_session import Session
import random
import string
import json
import os
import glob
import logging

secret_key = os.urandom(24)

app = Flask(__name__)
app.secret_key = secret_key
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False 

del secret_key

Session(app)

# Dictionary to store the message, username, and pin
shared_data = {}

# Define the path to the database folder
DATABASE_FOLDER = os.path.join(os.path.dirname(__file__), 'database')

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 11 * 1024 * 1024

@app.route('/')
def index():
    return render_template("home.html")

@app.route('/text')
def text():
    return render_template('index.html')


@app.route('/send', methods=['POST'])
def send():
    message = request.form['message']
    if not message:
        return jsonify({'error_message': "Message cannot be empty"})

    shared_data['message'] = message
    while True:
        username = ''.join(random.choices(string.ascii_lowercase, k=4))
        if not username_exists(username):
            break
    shared_data['username'] = username
    shared_data['pin'] = ''.join(random.choices(string.digits, k=4))

    if not os.path.exists(DATABASE_FOLDER):
        os.makedirs(DATABASE_FOLDER)
    
    filename = os.path.join(DATABASE_FOLDER, shared_data['username'] + '.json')
    with open(filename, 'w') as file:
        json.dump(shared_data, file)
    
    qr_code_link = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://justshare.pythonanywhere.com/download/{}/{}'.format(shared_data['username'], shared_data['pin'])
        
    return jsonify({'username': shared_data['username'], 'pin': shared_data['pin'], 'qr_code_link': qr_code_link})

def username_exists(username):
    # Check if the username exists in the database
    files = glob.glob(os.path.join(DATABASE_FOLDER, '*.json'))
    for file in files:
        with open(file) as f:
            data = json.load(f)
            if data.get('username') == username:
                return True
    return False

@app.route('/receive/<username>/<pin>', methods=['GET', 'POST'])
def receive_with_params(username, pin):
    # Process the request
    filename = os.path.join(DATABASE_FOLDER, username + '.json')

    if os.path.exists(filename):
        with open(filename, 'r') as file:
            data = json.load(file)
            if data['pin'] == pin:
                message = data.get('message', 'No message shared yet')
                message = message.replace('\r\n', '‎ ')
                session['message'] = message
                return redirect(url_for('text'))
            else:
                return render_template('index.html', error="Incorrect pin")
    else:
        return render_template('index.html', error="Username not found")

@app.route('/receive', methods=['POST'])
def receive():
    username = request.form['username']
    pin = request.form['pin']
    filename = os.path.join(DATABASE_FOLDER, username + '.json')

    if os.path.exists(filename):
        with open(filename, 'r') as file:
            data = json.load(file)
            if data['pin'] == pin:
                message = data.get('message', 'No message shared yet')
                message = message.replace('\r\n', '‎ ')
                session['message'] = message
                return jsonify({'message': message})
            else:
                session['error_message'] = "Incorrect PIN"
                return jsonify({'error_message': "Incorrect PIN"})
    else:
        session['error_message'] = "Username not found"
        return jsonify({'error_message': "Username not found"})

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Route to serve the HTML form for uploading files
@app.route('/files')
def files():
    error_message = session.pop('error_message', None)
    # Display the error message in the template if it exists
    if error_message:
        return render_template('index-files.html', error=error_message)
    else:
        return render_template('index-files.html')

MAX_FILE_SIZE = 11 * 1024 * 1024  

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify( error="File size exceeds the limit of 10 MB. Please choose a smaller file to upload."), 413

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']

    # Check if the file is empty
    if uploaded_file.filename == '':
        error_message = "No file selected. Please choose a file to upload."
        return jsonify(error=error_message)

    # Save the file
    folder_name = ''.join(random.choices(string.ascii_lowercase, k=4))
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name, uploaded_file.filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    uploaded_file.save(file_path)

    # Generate random 4-digit PIN
    pin = ''.join(random.choices(string.digits, k=4))

    # Store folder name and PIN in dictionary
    folder_pin_mapping = {'folder_name': folder_name, 'pin': pin}

    # Store folder name and PIN mapping in JSON file
    with open(os.path.join(app.config['UPLOAD_FOLDER'], folder_name, folder_name + '.json'), 'w') as f:
        json.dump(folder_pin_mapping, f)

    # Generate download link for QR code
    qr_code_link = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://justshare.pythonanywhere.com/download/{}/{}'.format(folder_name, pin)

    # Return folder name, PIN, and QR code link
    return jsonify(username=folder_name, pin=pin, qr_code_link=qr_code_link)

@app.route('/download/<folder_name>/<pin>', methods=['GET'])
def download_file_with_params(folder_name, pin):
    # Load the JSON file
    json_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name, folder_name + '.json')
    with open(json_path, 'r') as f:
        folder_pin_mapping = json.load(f)
    
    # Check if PIN and folder name match
    if folder_pin_mapping['pin'] == pin and folder_pin_mapping['folder_name'] == folder_name:
        files = [file for file in os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], folder_name)) if not file.endswith('.json')]
        if len(files) > 0:
            file_name = files[0]
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name, file_name)
            logging.info(f"Downloading file: {file_path}")
            return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], folder_name), file_name, as_attachment=True)
    else:
        logging.warning("Invalid PIN or folder name!")
        error_message = "Invalid PIN or folder name!"
        return render_template('index-files.html', error=error_message)

@app.route('/download', methods=['GET'])
def download_file():
    pin = request.args.get('pin')
    folder_name = request.args.get('folder_name')
    error_message = None

    if not folder_name or not pin:
        error_message = "Folder name or PIN missing."
        session['error_message'] = error_message
        return redirect(url_for('files'))

    # Load the JSON file if it exists
    json_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name, folder_name + '.json')
    if not os.path.exists(json_path):
        error_message = "Folder not found or JSON file missing."
        session['error_message'] = error_message
        return redirect(url_for('files'))

    with open(json_path, 'r') as f:
        folder_pin_mapping = json.load(f)

    # Check if PIN and folder name match
    if folder_pin_mapping['pin'] == pin and folder_pin_mapping['folder_name'] == folder_name:
        files = [file for file in os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], folder_name)) if not file.endswith('.json')]
        if len(files) > 0:
            file_name = files[0]
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name, file_name)
            logging.info(f"Downloading file: {file_path}")
            return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], folder_name), file_name, as_attachment=True)
        else:
            error_message = "No files found in the folder."
            session['error_message'] = error_message
            return redirect(url_for('files'))
    else:
        error_message = "Invalid PIN or folder name!"
        session['error_message'] = error_message
        return redirect(url_for('files'))
    
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0') 
