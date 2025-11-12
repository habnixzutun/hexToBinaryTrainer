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
        case "HexToDec":
            mode = 2;
            binaryInput.placeholder = "Dezimalzahl eingeben... ";
            break;
        case "BinToHex":
            mode = 3;
            binaryInput.placeholder = "Hexadezimalzahl eingeben... ";
            break;
        case "BinToDec":
            mode = 4;
            binaryInput.placeholder = "Dezimalzahl eingeben... ";
            break;
        case "DecToHex":
            mode = 5;
            binaryInput.placeholder = "Hexadezimalzahl eingeben... ";
            break;
        case "DecToBin":
            mode = 6;
            binaryInput.placeholder = "Binärzahl eingeben... ";
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
      const pointsCounter = document.getElementById('points-counter');
      const nameInput = document.getElementById("name-input");
      const nameButton = document.getElementById("name-button");
      const leaderboardReloader = document.getElementById("leaderboard-reloader");
      const url = new URL(location.href);
      console.log(url)

      var mode = 1;
      var bits = 8;
      const minBits = 4;
      const maxBits = 32;

      if (nameInput.value) {
        sendName();
      }

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
            case 2:
                hexOutput.textContent = "0x" + newHex.toString(16).toUpperCase();
                break;
            case 3:
            case 4:
                hexOutput.textContent = "0b" + formatBinary(newHex.toString(2));
                break;
            case 5:
            case 6:
                hexOutput.textContent = newHex.toString(10);
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

      leaderboardReloader.addEventListener('click', () => {
        window.location.reload();
      });

      function increaseCorrect() {
          correctCounter.textContent = parseInt(correctCounter.textContent) + 1;
          pointsCounter.textContent = parseInt(pointsCounter.textContent) + bits;
      }

      function increaseWrong() {
        wrongCounter.textContent = parseInt(wrongCounter.textContent) + 1;
        pointsCounter.textContent = parseInt(pointsCounter.textContent) - 4 * bits;
      }

      function formatBinary(bin) {
      var out = "";
      bin = bin.padStart(bits, "0");
      console.log("Original: " + bin);
      for (var i = 1; i <= bin.length; i++) {
          out += bin.charAt(i - 1);
          if (i % 4 == 0 && i != bin.length) {
              out += "_";
          }
      }
      console.log("with _: " + out)
      return out;
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
        bare_output = hexOutput.textContent.substring(2, bits + 2);
        output_as_int = parseInt(bare_output, 16);
        input = binaryInput.value;
        input_as_int = parseInt(input, 10)
        if (output_as_int == input_as_int) {
            return true;
        }
        return false;
      }

      function check_io_overlap_mode3() {
        bare_output = hexOutput.textContent.replaceAll("_", "").substring(2, bits + 2);
        output_as_int = parseInt(bare_output, 2);
        input = binaryInput.value;
        input_as_int = parseInt(input, 16)
        if (output_as_int == input_as_int) {
            return true;
        }
        return false;
      }

      function check_io_overlap_mode4() {
        bare_output = hexOutput.textContent.replaceAll("_", "").substring(2, bits + 2);
        output_as_int = parseInt(bare_output, 2);
        input = binaryInput.value;
        input_as_int = parseInt(input, 10)
        if (output_as_int == input_as_int) {
            return true;
        }
        return false;
      }

      function check_io_overlap_mode5() {
        bare_output = hexOutput.textContent;
        output_as_int = parseInt(bare_output, 10);
        input = binaryInput.value;
        input_as_int = parseInt(input, 16)
        if (output_as_int == input_as_int) {
            return true;
        }
        return false;
      }

      function check_io_overlap_mode6() {
        bare_output = hexOutput.textContent;
        output_as_int = parseInt(bare_output, 10);
        input = binaryInput.value;
        input_as_int = parseInt(input, 2)
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
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode1()) {
                                  increaseCorrect();
                                  sendData();
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                              }
                    break;
                case 6:
                    var binaryValue = binaryInput.value.replace(/[^01]/g, '');
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode6()) {
                                  increaseCorrect();
                                  sendData();
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                              }
                    break;
                case 2:
                    var binaryValue = binaryInput.value.replace(/[^0123456789]/g, '');
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode2()) {
                                  increaseCorrect();
                                  sendData();
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                              }
                    break;
                case 4:
                    var binaryValue = binaryInput.value.replace(/[^0123456789]/g, '');
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode4()) {
                                  increaseCorrect();
                                  sendData();
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                              }
                    break;
                case 3:
                    var binaryValue = binaryInput.value.toUpperCase().replace(/[^0123456789ABCDEF]/g, '');
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode3()) {
                                  increaseCorrect();
                                  sendData();
                                  refreshHexValue(bits);
                                  binaryInput.value = "";
                              }
                    break;
                case 5:
                    var binaryValue = binaryInput.value.toUpperCase().replace(/[^0123456789ABCDEF]/g, '');
                    binaryInput.value = binaryValue;
                              if (check_io_overlap_mode5()) {
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
                         alert("Wrong! " + hexOutput.textContent + " = 0b" + formatBinary(parseInt(hexOutput.textContent, 16).toString(2)));
                         increaseWrong();
                         sendData();
                         binaryInput.value = "";
                         break;
                    case 2:
                         alert("Wrong! " + hexOutput.textContent + " = " + parseInt(hexOutput.textContent, 16).toString(10));
                         increaseWrong();
                         sendData();
                         binaryInput.value = "";
                         break;
                    case 3:
                         alert("Wrong! " + hexOutput.textContent + " = 0x" + parseInt(hexOutput.textContent.replaceAll("_", "").substring(2, bits+2), 2).toString(16).toUpperCase());
                         increaseWrong();
                         sendData();
                         binaryInput.value = "";
                         break;
                    case 4:
                         alert("Wrong! " + hexOutput.textContent + " = " + parseInt(hexOutput.textContent.replaceAll("_", "").substring(2, bits+2), 2));
                         increaseWrong();
                         sendData();
                         binaryInput.value = "";
                         break;
                    case 5:
                         alert("Wrong! " + hexOutput.textContent + " = 0x" + parseInt(hexOutput.textContent, 10).toString(16).toUpperCase());
                         increaseWrong();
                         sendData();
                         binaryInput.value = "";
                         break;
                    case 6:
                         alert("Wrong! " + hexOutput.textContent + " = 0b" + formatBinary(parseInt(hexOutput.textContent, 10).toString(2)));
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
                                             name: nameInput.value,
                                             prev_correct: parseInt(correctCounter.textContent),
                                             prev_wrong: parseInt(wrongCounter.textContent),
                                             len: bits
                                             })
                  });

                  const result = await response.json();
                  console.log('Antwort vom Server:', result);
                  if (response.ok) {
                      correctCounter.textContent = result.correct;
                      wrongCounter.textContent = result.wrong;
                      pointsCounter.textContent = result.points;
                      binaryInput.removeAttribute("disabled");
                      nameInput.setAttribute("disabled", "disabled");
                      nameButton.setAttribute("disabled", "disabled");
                  }


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
                  if (response.ok) {
                      correctCounter.textContent = result.correct;
                      wrongCounter.textContent = result.wrong;
                      pointsCounter.textContent = result.points;
                  }

              } catch (error) {
                  console.error('Fehler beim Senden der Daten:', error);
                  //alert('Fehler: Konnte das Backend nicht erreichen.');
              }
          }

       refreshHexValue(bits);
});