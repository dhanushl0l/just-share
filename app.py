from flask import Flask, render_template, request, send_from_directory, jsonify, session
from flask_session import Session
import random
import string
import json
import os
import glob
import logging

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Environment specific configuration
if os.getenv('FLASK_ENV') == 'production':
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True
else:
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False

Session(app)

# Dictionary to store the message, username, and pin
shared_data = {}

# Define the path to the database folder
DATABASE_FOLDER = os.path.join(os.path.dirname(__file__), 'database')
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 11 * 1024 * 1024

@app.route('/')
def index():
    return render_template("home.html")

@app.route('/text')
def text():
    return render_template('index.html')

@app.route('/send', methods=['POST'])
def send_message():
    message = request.form['message']
    if not message:
        return jsonify({'error_message': "Message cannot be empty"})

    username, pin = generate_unique_username_and_pin()
    save_message_to_file(username, message, pin)

    qr_code_link_text = generate_qr_code_link_text(username, pin)
    return jsonify({'username': username, 'pin': pin, 'qr_code_link_text': qr_code_link_text})

def generate_unique_username_and_pin():
    while True:
        username = ''.join(random.choices(string.ascii_lowercase, k=4))
        if not username_exists(username):
            break
    pin = ''.join(random.choices(string.digits, k=4))
    return username, pin

def save_message_to_file(username, message, pin):
    shared_data['message'] = message
    shared_data['username'] = username
    shared_data['pin'] = pin

    if not os.path.exists(DATABASE_FOLDER):
        os.makedirs(DATABASE_FOLDER)
    
    filename = os.path.join(DATABASE_FOLDER, f'{username}.json')
    with open(filename, 'w') as file:
        json.dump(shared_data, file)


def username_exists(username):
    files = glob.glob(os.path.join(DATABASE_FOLDER, '*.json'))
    for file in files:
        with open(file) as f:
            data = json.load(f)
            if data.get('username') == username:
                return True
    return False

def generate_qr_code_link_text(username, pin):
    return f'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://justshare.pythonanywhere.com/receive/{username}/{pin}'

@app.route('/receive/<username>/<pin>', methods=['GET', 'POST'])
def receive_with_params(username, pin):
    if validate_username_and_pin(username, pin):
        message = load_message_from_file(username)
        session['message'] = message
        return render_template('index.html', message=message)
    else:
        error_message = "Invalid username or pin"
        session['error_message'] = error_message
        return render_template('index.html', error_message=error_message)


@app.route('/receive', methods=['POST'])
def receive_message():
    username = request.form['username']
    pin = request.form['pin']
    if validate_username_and_pin(username, pin):
        message = load_message_from_file(username)
        session['message'] = message
        return jsonify({'message': message})
    return jsonify({'error_message': session.get('error_message', "Invalid username or pin")})

def validate_username_and_pin(username, pin):
    filename = os.path.join(DATABASE_FOLDER, f'{username}.json')
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            data = json.load(file)
            if data['pin'] == pin:
                return True
            session['error_message'] = "Incorrect PIN"
    else:
        session['error_message'] = "Username not found"
    return False

def load_message_from_file(username):
    filename = os.path.join(DATABASE_FOLDER, f'{username}.json')
    with open(filename, 'r') as file:
        data = json.load(file)
    return data.get('message', 'No message shared yet').replace('\r\n', '‎ ')

@app.route('/files')
def upload_form():
    return render_template('index-files.html')

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify(error="File size exceeds the limit of 10 MB. Please choose a smaller file to upload."), 413

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return jsonify(error="No file selected. Please choose a file to upload.")
    
    folder_name, pin = save_uploaded_file(uploaded_file)
    qr_code_link_files = generate_qr_code_link_files(folder_name, pin)
    return jsonify(username=folder_name, pin=pin, qr_code_link_files=qr_code_link_files)

def save_uploaded_file(uploaded_file):
    folder_name = ''.join(random.choices(string.ascii_lowercase, k=4))
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name)
    os.makedirs(folder_path, exist_ok=True)
    
    file_path = os.path.join(folder_path, 'file')
    uploaded_file.save(file_path)
    
    pin = ''.join(random.choices(string.digits, k=4))
    save_folder_pin_mapping(folder_name, pin, uploaded_file.filename)
    return folder_name, pin

def save_folder_pin_mapping(folder_name, pin, original_file_name):
    folder_pin_mapping = {
        'folder_name': folder_name,
        'pin': pin,
        'original_file_name': original_file_name
    }

    json_folder_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name, 'json')
    os.makedirs(json_folder_path, exist_ok=True)
    json_file_path = os.path.join(json_folder_path, f'{folder_name}.json')
    with open(json_file_path, 'w') as f:
        json.dump(folder_pin_mapping, f)

def generate_qr_code_link_files(folder_name, pin):
    return f'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://justshare.pythonanywhere.com/download/{folder_name}/{pin}'

@app.route('/download/<folder_name>/<pin>', methods=['GET'])
@app.route('/download', methods=['GET'])
def download_file(folder_name=None, pin=None):
    if not folder_name or not pin:
        folder_name = request.args.get('folder_name')
        pin = request.args.get('pin')
        if not folder_name or not pin:
            return jsonify(error="Folder name or PIN missing.")

    if validate_folder_and_pin(folder_name, pin):
        file_path, original_file_name = get_file_path_and_original_name(folder_name)
        if file_path:
            logging.info(f"Downloading file: {file_path}")
            return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path), as_attachment=True, download_name=original_file_name)
    return jsonify(error=session.get('error_message', "Invalid PIN or username!"))

def validate_folder_and_pin(folder_name, pin):
    json_path = get_json_path(folder_name)
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            folder_pin_mapping = json.load(f)
            if folder_pin_mapping['pin'] == pin and folder_pin_mapping['folder_name'] == folder_name:
                return True
        session['error_message'] = "Invalid PIN or username!"
    else:
        session['error_message'] = "Folder not found or JSON file missing."
    return False

def get_file_path_and_original_name(folder_name):
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name)
    files = os.listdir(folder_path)
    if files:
        file_path = os.path.join(folder_path, files[0])
        json_path = get_json_path(folder_name)
        with open(json_path, 'r') as f:
            folder_pin_mapping = json.load(f)
        original_file_name = folder_pin_mapping['original_file_name']
        return file_path, original_file_name
    session['error_message'] = "No files found."
    return None, None

def get_json_path(folder_name):
    return os.path.join(app.config['UPLOAD_FOLDER'], folder_name, 'json', f'{folder_name}.json')
    
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0') 
