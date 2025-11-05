from tkinter import *
import random

from flask import Flask


def generate_hex_bin_pair(bits: int):
    number = random.randint(0, 2**bits)
    hex_number = hex(number)
    bin_number = bin(number)


if __name__ == "__main__":
    app = Flask("app")
    app.run("0.0.0.0", debug=True, port=80)
