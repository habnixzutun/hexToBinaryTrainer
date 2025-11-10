from datetime import datetime
from json import load, loads, dump, dumps
from os.path import isdir
from queue import Queue
import os
from flask import Flask, render_template, request, jsonify, url_for
import os
from werkzeug.middleware.proxy_fix import ProxyFix
from threading import Thread

app_root = os.environ.get('FLASK_APPLICATION_ROOT', '/')
if app_root.endswith('/') and app_root != '/':
    app_root = app_root[:-1]

# INITIALISIERE Flask mit dem korrekten static_url_path
# Dies ist der entscheidende Teil für die statischen Dateien!
app = Flask(__name__, static_url_path=f"{app_root}/static")

# Debug Print, um zu bestätigen, was static_url_path ist
print(f"DEBUG_STARTUP: Flask app.static_url_path set to: '{app.static_url_path}'")

# Setze APPLICATION_ROOT trotzdem noch (gute Praxis für andere url_for Aufrufe)
app.config['APPLICATION_ROOT'] = app_root
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

QUEUE = Queue()
JSON = {}

@app.route("/", methods=["GET"])
def index():
    ip = request.remote_addr
    name = get_name_from_ip(ip)
    # NEUE DEBUG ZEILE: Prüfen, was url_for wirklich generiert
    debug_css_path = url_for('static', filename='css/style.css')
    print(f"DEBUG: url_for('static', filename='css/style.css') generates: '{debug_css_path}'") # <-- NEUE DEBUG ZEILE
    if not name:
        return render_template("index.html",
                               name="",
                               points=0,
                               correct=0,
                               wrong=0)
    return render_template("index.html",
                           name=name,
                           points=JSON[name]["points"],
                           correct=JSON[name]["correct"],
                           wrong=JSON[name]["wrong"])


@app.route("/data", methods=["POST"])
def get_data():
    data = request.get_json()
    if not data or not data.get("len") or not (data.get("right") or data.get("incorrect")):
        return jsonify({"status": "error", "message": "Keine Daten erhalten"}), 400
    if not data.get("name"):
        return jsonify({"status": "error", "message": "Keinen Namen erhalten"}), 400

    name = data["name"]
    if not JSON.get(name):
        add_new_user(name, request.remote_addr)
    old_correct = JSON[name]["correct"]
    old_wrong = JSON[name]["wrong"]
    if not (old_correct > data["right"] or old_wrong > data["incorrect"]):
        JSON[name]["correct"] = data["right"]
        JSON[name]["wrong"] = data["incorrect"]
        JSON[name]["points"] += (data["len"] * (data["right"] - old_correct)) - 8 * (data["len"] * (data["incorrect"] - old_wrong))
    if request.remote_addr not in JSON[name]["ip"]:
        JSON[name]["ip"].append(request.remote_addr)
    QUEUE.put(JSON)
    return jsonify({
        "status": "success",
        "message": "Daten erfolgreich verarbeitet!",
        name: JSON[name]
    })

@app.route("/name", methods=["POST"])
def get_name():
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"status": "error", "message": "Keine Daten erhalten"}), 400
    name = data["name"]
    value = JSON.get(name)
    if not value:
        add_new_user(name, request.remote_addr)
    return jsonify({
        name: JSON[name],
    })


def init_json():
    with open("storage.json", "w") as file:
        dump({}, file)


def save_to_json():
    while True:
        try:
            data = QUEUE.get()
            print(data)
        except RuntimeError:
            continue
        with open("storage.json", "w", encoding="utf-8") as file:
            dump(dict(data), file, indent=4)
        if not isdir("backup"):
            os.mkdir("backup")
        with open("backup/" + "storage" + str(datetime.now().timestamp()) + ".json", "w", encoding="utf-8") as file:
            dump(dict(data), file, indent=4)
        QUEUE.task_done()

def get_name_from_ip(ip):
    print("DEBUG: get_name_from_ip: ", ip)
    print("DEBUG: get_name_from_ip: ", JSON)
    for name, value in JSON.items():
        if ip in value["ip"]:
            return name
    return ""

def add_new_user(name, ip):
    JSON[name] = {
        "ip": [ip],
        "name": name,
        "correct": 0,
        "wrong": 0,
        "points": 0
    }
    QUEUE.put(JSON)
    return name

if __name__ == "__main__":
    if not os.path.isfile("storage.json"):
        init_json()
    with open("storage.json", "r") as file:
        JSON = load(file)

    Thread(target=save_to_json, daemon=True).start()
    app.run("0.0.0.0", debug=True, port=int(os.environ.get('PORT', 5000)))
