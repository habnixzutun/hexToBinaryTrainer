from json import load, loads, dump, dumps
from queue import Queue
import os
from flask import Flask, render_template, request, jsonify, url_for
import os
from werkzeug.middleware.proxy_fix import ProxyFix

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
JSON = ""

@app.route("/", methods=["GET"])
def index():
    # NEUE DEBUG ZEILE: Prüfen, was url_for wirklich generiert
    debug_css_path = url_for('static', filename='css/style.css')
    print(f"DEBUG: url_for('static', filename='css/style.css') generates: '{debug_css_path}'") # <-- NEUE DEBUG ZEILE
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


    app.run("0.0.0.0", debug=True, port=int(os.environ.get('PORT', 5000)))
