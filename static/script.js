document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-item');

  tabs.forEach(clickedTab => {
    clickedTab.addEventListener('click', (e) => {
      // Verhindert das Neuladen der Seite
      e.preventDefault();

      // Entferne die 'active' Klasse von allen Tabs
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });

      // Füge die 'active' Klasse nur dem geklickten Tab hinzu
      clickedTab.classList.add('active');
      var tmp = mode;
      switch (clickedTab.textContent) {
        case "HexToBin":
            mode = 1;
            break;
        case "BinToHex":
            mode = 2;
            break;
      }
      if (tmp != mode) {
        refreshHexValue(8);
        binaryInput.value = "";
      }
      console.log(mode);
    });
  });
      const binaryInput = document.getElementById('binary-input');
      const hexOutput = document.getElementById('hex-output');
      const sendButton = document.getElementById('send-button');
      const bitInput = document.getElementById('bit-input');
      var mode = 1

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
                hexOutput.textContent = "0b" + newHex.toString(2);
                break;
        }

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
                                  refreshHexValue(8);
                                  binaryInput.value = "";
                              }
                    break;
                case 2:
                    var binaryValue = binaryInput.value.toUpperCase().replace(/[^0123456789ABCDEF]/g, '');
                    var decimalValue = parseInt(binaryValue, 16);
                    var hexValue = decimalValue.toString(2);
                    binaryInput.value = binaryValue;
                              if ("0b" + hexValue == hexOutput.textContent) {
                                  refreshHexValue(8);
                                  binaryInput.value = "";
                              }
                    break;
            }


      });

      // Event-Listener für den Sende-Button (ruft jetzt nur die Funktion auf)
      sendButton.addEventListener('click', () => refreshHexValue(8));

      // NEU: Event-Listener für Tastendrücke im Eingabefeld
      binaryInput.addEventListener('keydown', (event) => {
          // Prüfen, ob die gedrückte Taste "Enter" ist
          if (event.key === 'Enter') {
              // Verhindert das Standardverhalten (z.B. Formular-Absenden, das einen Reload auslöst)
              event.preventDefault();

                switch (mode) {
                    case 1:
                         if ("0x" + binaryInput.value != hexOutput.textContent)
                         alert("Wrong! " + hexOutput.textContent + " = 0b" + parseInt(hexOutput.textContent, 16).toString(2));
                         break;
                    case 2:
                         if ("0b" + binaryInput.value != hexOutput.textContent)
                         alert("Wrong! " + hexOutput.textContent + " = 0x" + parseInt(hexOutput.textContent.substring(2, 8+2), 2).toString(16).toUpperCase());
                         break;
                }


              refreshHexValue(8);
          }
      });
      refreshHexValue(8);
});