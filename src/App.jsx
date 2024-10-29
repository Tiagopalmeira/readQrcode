import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner() {
  // Estado para gerenciar se a câmera está ativa ou não
  const [isCameraActive, setIsCameraActive] = useState(false);
  // Estado para armazenar o texto decodificado do QR code
  const [qrCodeText, setQrCodeText] = useState("");

  useEffect(() => {
    // Verifica se a câmera está ativa, e se estiver, inicia o scanner de QR code
    if (isCameraActive) {
      startQrScanner();
    }
  }, [isCameraActive]);

  const startQrScanner = () => {
    // Cria uma instância do Html5QrcodeScanner com configurações de frame por segundo e caixa de captura
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 400, height: 400 } },
      false // verbose (detalhamento desativado)
    );

    // Inicia o scanner e configura callbacks para sucesso e erro
    html5QrCodeScanner.render(
      (decodedText, decodedResult) => {
        // Callback de sucesso: armazena o texto decodificado no estado
        setQrCodeText(decodedText);
      },
      (errorMessage) => {
        // Callback de erro: exibe mensagem de erro no console
        console.error("Erro ao escanear: " + errorMessage);
      }
    );

    // Retorna uma função de cleanup para limpar a instância do scanner quando o componente for desmontado
    return () => {
      html5QrCodeScanner.clear();
    };
  };

  const handleStartCamera = () => {
    // Ativa a câmera ao definir isCameraActive como true
    setIsCameraActive(true);
  };

  const handleFileInputChange = (e) => {
    // Obtém o arquivo selecionado pelo usuário
    const file = e.target.files[0];
    // Cria uma nova instância do Html5QrcodeScanner para o arquivo
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 400, height: 400 } },
      false // verbose
    );

    // Limpa qualquer scanner ativo antes de iniciar a leitura do arquivo
    html5QrCodeScanner.clear();

    // Inicia o scanner com o arquivo selecionado e configura callbacks de sucesso e erro
    html5QrCodeScanner.start(
      { videoSource: file },
      (decodedText, decodedResult) => {
        // Callback de sucesso: armazena o texto decodificado no estado
        setQrCodeText(decodedText);
      },
      (errorMessage) => {
        // Callback de erro: exibe mensagem de erro no console
        console.error("Erro ao escanear o arquivo: ", errorMessage);
      }
    );
  };

  return (
    <div>
      <h1>Leitor de códigos de barras</h1>
      {/* Div onde o vídeo da câmera ou a imagem será exibida */}
      <div id="reader" style={{ width: "100%", height: "400px", border: "2px solid #333", margin: "20px auto" }}></div>

      {/* Input de arquivo oculto para selecionar uma imagem com QR code */}
      <input type="file" accept="image/*" onChange={handleFileInputChange} style={{ display: "none" }} />

      {/* Botão para ativar a câmera e iniciar o scanner */}
      <button onClick={handleStartCamera} disabled={isCameraActive}>Ativar Câmera</button>

      {/* Botão para selecionar um arquivo e iniciar o scanner no arquivo */}
      <button onClick={() => document.querySelector('input[type="file"]').click()} disabled={isCameraActive}>Selecionar arquivo</button>

      {/* Input de texto que exibe o texto decodificado do QR code e permite edição manual */}
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
