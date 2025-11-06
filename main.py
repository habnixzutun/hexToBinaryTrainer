from json import load, loads, dump, dumps
from queue import Queue
from flask import Flask, render_template, jsonify, request
import os

app = Flask("app")
QUEUE = Queue()
JSON = ""

@app.route("/", methods=["GET"])
def index(bits: int = 4):
    return render_template("index.html")

@app.route("/data", methods=["POST"])
def get_data():
    data = request.get_json()
    if not data or not data.get("binary"):
        return jsonify({"status": "error", "message": "Keine Daten erhalten"}), 400
    data = dict(data)
    data.update({"ip": request.remote_addr})
    print(data)
    return jsonify({
        "status": "success",
        "message": "Daten erfolgreich verarbeitet!",
    })


def init_json():
    pass


if __name__ == "__main__":
    if not os.path.isfile("db.json"):
        init_json()


    app.run("0.0.0.0", debug=True, port=80)
