from datetime import datetime
from hashlib import sha256
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
    ip = hash(request.remote_addr)
    name = get_name_from_ip(ip)
    # NEUE DEBUG ZEILE: Prüfen, was url_for wirklich generiert
    debug_css_path = url_for('static', filename='css/style.css')
    print(f"DEBUG: url_for('static', filename='css/style.css') generates: '{debug_css_path}'") # <-- NEUE DEBUG ZEILE
    if not name:
        return render_template("index.html",
                               name="",
                               points=0,
                               correct=0,
                               wrong=0,
                               leaderboard=return_leaderboard())
    return render_template("index.html",
                           name=name,
                           points=JSON[name]["points"],
                           correct=JSON[name]["correct"],
                           wrong=JSON[name]["wrong"],
                           leaderboard=return_leaderboard())


@app.route("/data", methods=["POST"])
def post_data():
    data = request.get_json()
    if not data or not data.get("len") or not (data.get("right") or data.get("incorrect")):
        return jsonify({"status": "error", "message": "Keine Daten erhalten"}), 400
    if not data.get("name"):
        return jsonify({"status": "error", "message": "Keinen Namen erhalten"}), 400

    name = data["name"]
    if not JSON.get(name):
        add_new_user(name, hash(request.remote_addr))
    old_correct = JSON[name]["correct"]
    old_wrong = JSON[name]["wrong"]
    if not (old_correct > data["right"] or old_wrong > data["incorrect"]):
        JSON[name]["correct"] = data["right"]
        JSON[name]["wrong"] = data["incorrect"]
        JSON[name]["points"] += (data["len"] * (data["right"] - old_correct)) - 4 * (data["len"] * (data["incorrect"] - old_wrong))
    if hash(request.remote_addr) not in JSON[name]["ip"]:
        JSON[name]["ip"].append(hash(request.remote_addr))
    QUEUE.put(JSON)
    user = JSON[name]
    return jsonify({
        "status": "success",
        "message": "Daten erfolgreich verarbeitet!",
        "wrong": user["wrong"],
        "correct": user["correct"],
        "points": user["points"],
    })

@app.route("/name", methods=["POST"])
def post_name():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("prev_correct") or not data.get("prev_wrong") or not data.get("len"):
        return jsonify({"status": "error", "message": "Keine Daten erhalten"}), 400
    name = data["name"]
    value = JSON.get(name)
    if not value:
        add_new_user(name, hash(request.remote_addr))
        JSON[name]["correct"] = data["prev_correct"]
        JSON[name]["wrong"] = data["prev_wrong"]
        JSON[name]["points"] = data["prev_correct"] * data["len"] - 4 * (data["prev_wrong"] * data["len"])
    elif hash(request.remote_addr) not in JSON[name]["ip"]:
        JSON[name]["ip"].append(hash(request.remote_addr))
        JSON[name]["correct"] += data["prev_correct"]
        JSON[name]["wrong"] += data["prev_wrong"]
        JSON[name]["points"] += data["prev_correct"] * data["len"] - 4 * (data["prev_wrong"] * data["len"])
    user = JSON[name]
    return jsonify({
        "wrong": user["wrong"],
        "correct": user["correct"],
        "points": user["points"],
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

def return_leaderboard():
    return_list = list(JSON.values())
    return_list.sort(key=lambda x: (x["points"], -x['correct']), reverse=True)
    print(return_list, type(return_list))
    for i in range(len(return_list)):
        return_list[i].update({"index": i+1})
    print(return_list)
    return return_list

def hash(x):
    return sha256(str(x).encode()).hexdigest()

def turn_ips_into_hashes():
    for key, value in JSON.items():
        for ip in list(value["ip"]):
            if len(ip) != 64:
                JSON[key]["ip"].remove(ip)
                JSON[key]["ip"].append(hash(ip))


if __name__ == "__main__":
    if not os.path.isfile("storage.json"):
        init_json()
    with open("storage.json", "r") as file:
        JSON = load(file)
    print("DEBUG: JSON: ", JSON)
    if JSON.get("SelimKing") is not None:
        JSON.pop("SelimKing")
    turn_ips_into_hashes()
    print("DEBUG: turn_ips_into_hashes: ", JSON)

    Thread(target=save_to_json, daemon=True).start()
    app.run("0.0.0.0", debug=True, port=int(os.environ.get('PORT', 5000)))
