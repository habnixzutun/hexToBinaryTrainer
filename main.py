from tkinter import *
import random
from flask import Flask, render_template, redirect, url_for, request, jsonify

app = Flask("app")


def generate_hex(bits: int):
    if bits <= 0:
        raise AttributeError("amount of bits must be greater than 0")
    number = random.randint(2**(bits - 1), 2**bits)
    hex_number = hex(number)

    return hex_number


@app.route("/", methods=["GET"])
def index(bits: int = 4):
    return render_template("index.html")


# Eine Route definieren, die auf POST-Requests unter "/process" hört
@app.route('/getBinToHex', methods=['POST'])
def process_data():
    # Die gesendeten JSON-Daten aus dem Request holen
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "Keine Daten erhalten"}), 400

    # Daten aus dem JSON-Objekt auslesen
    binary_value = data.get('binary')

    new_hex = generate_hex(0)

    # Eine Erfolgsantwort als JSON zurück an das Front-End senden
    return jsonify({
        "status": "success",
        "message": "Daten erfolgreich verarbeitet!",
        "hex": generate_hex(0)
    })

if __name__ == "__main__":
    app.run("0.0.0.0", debug=True, port=80)
