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
      const nameInput = document.getElementById("name-input");
      const nameButton = document.getElementById("name-button");
      const url = new URL(location.href);
      console.log(url)

      var mode = 1;
      var bits = 8;
      const minBits = 4;
      const maxBits = 32;

      function randomIntFromInterval(min, max) { // min and max included
         return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function refreshHexValue(bits) {
        var newHex = randomIntFromInterval(Math.pow(2, (bits - 5) + 1), Math.pow(2, bits) - 1);
        console.log("Bits" + (bits - 5));
        console.log(newHex.toString(16));
        console.log(newHex.toString(2).padStart(bits, "0"));
        console.log(newHex);
        switch (mode) {
            case 1:
                hexOutput.textContent = "0x" + newHex.toString(16).toUpperCase();
                break;
            case 2:
                hexOutput.textContent = "0b" + formatBinary(newHex.toString(2));
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
        correctCounter.textContent = parseInt(correctCounter.textContent) + 1;
        console.log("Correct: " + parseInt(correctCounter.textContent));
      }

      function increaseWrong() {
        wrongCounter.textContent = parseInt(wrongCounter.textContent) + 1;
        console.log("Wrong: " + parseInt(wrongCounter.textContent));
      }

      function formatBinary(bin) {
      var r = [];
      console.log("Bin: " + bin);
      bin = bin.padStart(bits, "0")
        for (var i = 0; i < bin.length / 4; i++) {
            r.push(bin.substring(i, i + 4));
        }
      console.log(r.join("_"));
      return r.join("_");
      }

      function check_io_overlap_mode1() {
        bare_output = hexOutput.textContent.substring(2, bits + 2);
        output_as_int = parseInt(bare_output, 16);
        input = binaryInput.value;
        input_as_int = parseInt(input, 2)
        if (output_as_int == input_as_int) {
            return true;
        }
        return false;
      }

      function check_io_overlap_mode2() {
        bare_output = hexOutput.textContent.replaceAll("_", "").substring(2, bits + 2);
        output_as_int = parseInt(bare_output, 2);
        input = binaryInput.value;
        input_as_int = parseInt(input, 16)
        if (output_as_int == input_as_int) {
            return true;
        }
        return false;
      }

      // Live-Umrechnung (bleibt wie zuvor)
      binaryInput.addEventListener('input', () => {
           switch (mode) {
                case 1:
                    var binaryValue = binaryInput.value.replace(/[^01]/g, '');
                    var decimalValue = parseInt(binaryValue, 2);
                    var hexValue = decimalValue.toString(16).toUpperCase();
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode1()) {
                                  increaseCorrect();
                                  sendData();
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                              }
                    break;
                case 2:
                    var binaryValue = binaryInput.value.toUpperCase().replace(/[^0123456789ABCDEF]/g, '');
                    var decimalValue = parseInt(binaryValue, 16);
                    var hexValue = decimalValue.toString(2);
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode2()) {
                                  increaseCorrect();
                                  sendData();
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
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
                         if (check_io_overlap_mode1())
                         alert("Wrong! " + hexOutput.textContent + " = 0b" + formatBinary(parseInt(hexOutput.textContent, 16).toString(2)));
                         increaseWrong();
                         sendData();
                         binaryInput.value = "";
                         break;
                    case 2:
                         if (check_io_overlap_mode2())
                         alert("Wrong! " + hexOutput.textContent + " = 0x" + parseInt(hexOutput.textContent.replaceAll("_", "").substring(2, bits+2), 2).toString(16).toUpperCase());
                         increaseWrong();
                         sendData();
                         binaryInput.value = "";
                         break;
                }


              refreshHexValue(bits);
          }
      });

      nameInput.addEventListener('keydown', (event) => {
          // Prüfen, ob die gedrückte Taste "Enter" ist
          if (event.key === 'Enter') {
              // Verhindert das Standardverhalten (z.B. Formular-Absenden, das einen Reload auslöst)
              event.preventDefault();
              sendName();
          }
      });

      nameButton.addEventListener("click", () => {
        sendName();
      });

      async function sendName() {
        console.log('Sende Name:', {name: nameInput.value});
              try {
                  console.log(url.href + '/name');
                  const response = await fetch(url.href + '/name', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                                             name: nameInput.value
                                             })
                  });

                  const result = await response.json();
                  console.log('Antwort vom Server:', result);

              } catch (error) {
                  console.error('Fehler beim Senden der Daten:', error);
                  //alert('Fehler: Konnte das Backend nicht erreichen.');
              }
      }

      async function sendData() {
              if (nameInput.value == "") {
                    alert("Bitte einen Namen eingeben");
              }

              console.log('Sende Daten:', { len: bits,
                                            name: nameInput.value,
                                            right: parseInt(correctCounter.textContent),
                                            incorrect: parseInt(wrongCounter.textContent),
                                            name: nameInput.value});

              try {
                  console.log(url.href + '/data');
                  const response = await fetch(url.href + '/data', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                                             name: nameInput.value,
                                             len: bits,
                                             right: parseInt(correctCounter.textContent),
                                             incorrect: parseInt(wrongCounter.textContent)
                                             })
                  });

                  const result = await response.json();
                  console.log('Antwort vom Server:', result);

              } catch (error) {
                  console.error('Fehler beim Senden der Daten:', error);
                  //alert('Fehler: Konnte das Backend nicht erreichen.');
              }
          }

       refreshHexValue(bits);
});