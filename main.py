from json import load, loads, dump, dumps
from queue import Queue
from flask import Flask, render_template, jsonify, request
import os
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask("app")
QUEUE = Queue()
JSON = ""

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/data", methods=["POST"])
def get_data():
    data = request.get_json()
    if not data or not data.get("len"):
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
    app.config['APPLICATION_ROOT'] = os.environ.get('FLASK_APPLICATION_ROOT', '/')
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)


    app.run("0.0.0.0", debug=True, port=int(os.environ.get('PORT', 5000)))
