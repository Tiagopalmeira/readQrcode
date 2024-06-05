import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [qrCodeText, setQrCodeText] = useState("");

  useEffect(() => {
    if (isCameraActive) {
      startQrScanner();
    }
  }, [isCameraActive]);

  const startQrScanner = () => {
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 400, height: 400 } },
      false // verbose
    );

    html5QrCodeScanner.render(
      (decodedText, decodedResult) => {
        setQrCodeText(decodedText);
      },
      (errorMessage) => {
        console.error("Erro ao escanear: " + errorMessage);
      }
    );

    return () => {
      html5QrCodeScanner.clear();
    };
  };

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 400, height: 400 } },
      false // verbose
    );

    html5QrCodeScanner.clear(); // Clear any existing scanner

    html5QrCodeScanner.start(
      { videoSource: file },
      (decodedText, decodedResult) => {
        setQrCodeText(decodedText);
      },
      (errorMessage) => {
        console.error("Erro ao escanear o arquivo: ", errorMessage);
      }
    );
  };

  return (
    <div>
      <h1>Leitor de códigos de barrasq</h1>
      <div id="reader" style={{ width: "100%", height: "400px", border: "2px solid #333", margin: "20px auto" }}></div>

      <input type="file" accept="image/*" onChange={handleFileInputChange} style={{ display: "none" }} />

      <button onClick={handleStartCamera} disabled={isCameraActive}>Ativar Câmera</button>

      <button onClick={() => document.querySelector('input[type="file"]').click()} disabled={isCameraActive}>Selecionar arquivo</button>

      <input
        type="text"
        value={qrCodeText}
        onChange={(e) => setQrCodeText(e.target.value)}
        placeholder="Texto do código QR"
        style={{ marginTop: "20px" }}
      />
    </div>
  );
}

export default QRScanner;
