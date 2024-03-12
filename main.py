import os
from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)

# Store the message to be shared
shared_message = ""

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/send', methods=['GET', 'POST'])
def send():
    global shared_message
    if request.method == 'POST':
        shared_message = request.form['message']
        username = ''.join(random.choices(string.ascii_lowercase, k=4))
        pin = ''.join(random.choices(string.digits, k=4))
        return jsonify({"username": username, "pin": pin})
    return render_template('send.html')

@app.route('/receive', methods=['GET', 'POST'])
def receive():
    global shared_message
    if request.method == 'POST':
        username = request.form['username']
        pin = request.form['pin']
        if username == "" or pin == "":
            return "Please enter both username and pin"
        if username == request.form.get("username") and pin == request.form.get("pin"):  
            return shared_message
        else:
            return "Incorrect username or pin"
    return render_template('receive.html')

if __name__ == '__main__':
    app.run(debug=True)
