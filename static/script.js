document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-item');

  tabs.forEach(clickedTab => {
    clickedTab.addEventListener('click', (e) => {
      e.preventDefault();

      tabs.forEach(tab => {
        tab.classList.remove('active');
      });

      clickedTab.classList.add('active');
      var tmp = mode;
      switch (clickedTab.textContent) {
        case "HexToBin":
            mode = 1;
            binaryInput.placeholder = "Binärzahl eingeben... ";
            break;
        case "BinToHex":
            mode = 2;
            binaryInput.placeholder = "Hexadezimalzahl eingeben... ";
            break;
      }
      if (tmp != mode) {
        refreshHexValue(bits);
        binaryInput.value = "";
      }
      console.log(mode);
    });
  });
      const binaryInput = document.getElementById('binary-input');
      const hexOutput = document.getElementById('hex-output');
      const sendButton = document.getElementById('send-button');
      const bitAmount = document.getElementById('bit-amount');
      const increaseButton = document.getElementById('increase-bits');
      const decreaseButton = document.getElementById('decrease-bits');
      const correctCounter = document.getElementById('correct-counter');
      const wrongCounter = document.getElementById('wrong-counter');
      var mode = 1;
      var bits = 8;
      const minBits = 4;
      const maxBits = 64;
      var correct = 0;
      var wrong = 0;

      function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      function refreshHexValue(bits) {
        var newHex = randomIntFromInterval(Math.pow(2, (bits - 1)), Math.pow(2, bits));
        console.log(newHex.toString(16));
        console.log(newHex.toString(2));
        console.log(newHex);
        switch (mode) {
            case 1:
                hexOutput.textContent = "0x" + newHex.toString(16).toUpperCase();
                break;
            case 2:
                hexOutput.textContent = "0b" + formatBinary(newHex.toString(2));
                formatBinary(newHex.toString(2));
                break;
        }

      }

      increaseButton.addEventListener('click', () => {
        bits += 4;
        if (bits > maxBits) {
            bits = maxBits;
            alert("Du kannst nicht mehr als " + maxBits + " Bits auswählen");
            refreshHexValue(bits);
        }
        else {
            refreshHexValue(bits);
        }
        if (bits < 10) {
            bitAmount.textContent = "0" + bits;
        }
        else {
            bitAmount.textContent = bits;
        }

      });

      decreaseButton.addEventListener('click', () => {
              bits -= 4;
              if (bits < minBits) {
                  bits = minBits;
                  alert("Du kannst nicht weniger als " + minBits + " Bits auswählen");
              }
              else {
                refreshHexValue(bits);
              }

            if (bits < 10) {
                bitAmount.textContent = "0" + bits;
            }
            else {
                bitAmount.textContent = bits;
            }
      });

      function increaseCorrect() {
        correct += 1;
        console.log("Correct: " + correct);
        correctCounter.textContent = correct;
      }

      function increaseWrong() {
        wrong += 1;
        console.log("Wrong: " + wrong);
        wrongCounter.textContent = wrong;
      }

      function formatBinary(bin) {
      var r = [];
      console.log("Bin: " + bin);
        for (var i = 0; i < bin.length / 4; i++) {
            r.push(bin.substring(i, i + 4));
        }
      console.log(r.join("_"));
      return r.join("_");
      }

      // Live-Umrechnung (bleibt wie zuvor)
      binaryInput.addEventListener('input', () => {
           switch (mode) {
                case 1:
                    var binaryValue = binaryInput.value.replace(/[^01]/g, '');
                    var decimalValue = parseInt(binaryValue, 2);
                    var hexValue = decimalValue.toString(16).toUpperCase();
                    binaryInput.value = binaryValue;
                              if ("0x" + hexValue == hexOutput.textContent) {
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                                  increaseCorrect();
                              }
                    break;
                case 2:
                    var binaryValue = binaryInput.value.toUpperCase().replace(/[^0123456789ABCDEF]/g, '');
                    var decimalValue = parseInt(binaryValue, 16);
                    var hexValue = decimalValue.toString(2);
                    binaryInput.value = binaryValue;
                              if ("0b" + hexValue == hexOutput.textContent.replaceAll("_", "")) {
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                                  increaseCorrect();
                              }
                    break;
            }


      });

      // Event-Listener für den Sende-Button (ruft jetzt nur die Funktion auf)
      sendButton.addEventListener('click', () => refreshHexValue(bits));

      // NEU: Event-Listener für Tastendrücke im Eingabefeld
      binaryInput.addEventListener('keydown', (event) => {
          // Prüfen, ob die gedrückte Taste "Enter" ist
          if (event.key === 'Enter') {
              // Verhindert das Standardverhalten (z.B. Formular-Absenden, das einen Reload auslöst)
              event.preventDefault();

                switch (mode) {
                    case 1:
                         if ("0x" + binaryInput.value != hexOutput.textContent)
                         alert("Wrong! " + hexOutput.textContent + " = 0b" + formatBinary(parseInt(hexOutput.textContent, 16).toString(2)));
                         increaseWrong();
                         binaryInput.value = "";
                         break;
                    case 2:
                         if ("0b" + binaryInput.value != hexOutput.textContent.replaceAll("_", ""))
                         alert("Wrong! " + hexOutput.textContent + " = 0x" + parseInt(hexOutput.textContent.replaceAll("_", "").substring(2, bits+2), 2).toString(16).toUpperCase());
                         increaseWrong();
                         binaryInput.value = "";
                         break;
                }


              refreshHexValue(bits);
          }
      });
      refreshHexValue(bits);
});