from flask import Flask, render_template

app = Flask("app")

@app.route("/", methods=["GET"])
def index(bits: int = 4):
    return render_template("index.html")


if __name__ == "__main__":
    app.run("0.0.0.0", debug=True, port=80)
