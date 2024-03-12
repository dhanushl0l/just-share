import os
from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)

# Dictionary to store the message, username, and pin
shared_data = {}

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/send', methods=['GET', 'POST'])
def send():
    global shared_data
    if request.method == 'POST':
        shared_data['message'] = request.form['message']
        shared_data['username'] = ''.join(random.choices(string.ascii_lowercase, k=4))
        shared_data['pin'] = ''.join(random.choices(string.digits, k=4))
        return jsonify({"username": shared_data['username'], "pin": shared_data['pin']})
    return render_template('send.html')

@app.route('/receive', methods=['GET', 'POST'])
def receive():
    global shared_data
    if request.method == 'POST':
        username = request.form['username']
        pin = request.form['pin']
        if username == shared_data.get('username') and pin == shared_data.get('pin'):  
            return shared_data.get('message', 'No message shared yet')
        else:
            return "Incorrect username or pin"
    return render_template('receive.html')

if __name__ == '__main__':
    app.run(debug=True)
