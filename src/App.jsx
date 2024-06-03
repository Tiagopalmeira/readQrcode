import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./App.css";

function QRScanner() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [qrCodeText, setQrCodeText] = useState("");

  useEffect(() => {
    if (isCameraActive) {
      startQrScanner();
    }
  }, [isCameraActive]);

  const startQrScanner = () => {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" },
      function (decodedText) {
        setQrCodeText(decodedText);
      },
      function (errorMessage) {
        console.error("Erro ao escanear: " + errorMessage);
      }
    );

    return () => {
      html5QrCode.stop();
    };
  };

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        setQrCodeText(decodedText);
      })
      .catch(err => {
        console.error("Erro ao escanear o arquivo: ", err);
      });
  };

  return (
    <div>
      <div id="reader" style={{ width: "100%", maxWidth: "600px", height: "400px", border: "2px solid #333", margin: "20px auto" }}></div>

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
