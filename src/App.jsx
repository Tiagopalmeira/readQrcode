import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode"; // Importa o componente Html5QrcodeScanner
import "../../public/css/form.css"; // Importa o arquivo de estilos CSS

function QRScanner() {
  // Define os estados para controlar a ativação da câmera e o texto do código QR
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [qrCodeText, setQrCodeText] = useState("");

  // Efeito para inicializar e limpar o scanner de QR Code quando a câmera é ativada ou desativada
  useEffect(() => {
    let html5QrcodeScanner;

    // Inicializa o scanner quando a câmera está ativa
    if (isCameraActive) {
      html5QrcodeScanner = startQrScanner();
    }

    // Limpa o scanner quando o componente é desmontado ou a câmera é desativada
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(err => console.error("Falha ao limpar o scanner de QR Code.", err));
      }
    };
  }, [isCameraActive]); // Executa o efeito quando o estado isCameraActive é modificado

  // Função para iniciar o scanner de QR Code
  const startQrScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", // ID do elemento onde o scanner será renderizado
      { fps: 10, qrbox: 500 }, // Opções de configuração do scanner
      false // Modo de verbosidade (verbose)
    );

    // Renderiza o scanner com callbacks para tratamento de resultados
    html5QrcodeScanner.render(
      (decodedText, decodedResult) => {
        setQrCodeText(decodedText); // Atualiza o estado com o texto do código QR lido
      },
      (errorMessage) => {
        console.error("Erro ao escanear: " + errorMessage); // Registra erro no console
      }
    );

    return html5QrcodeScanner; // Retorna o scanner para possíveis operações futuras
  };

  // Função para lidar com a ativação da câmera
  const handleStartCamera = () => {
    setIsCameraActive(true); // Define o estado para ativar a câmera
  };

  // Função para lidar com a seleção de arquivo
  const handleFileInputChange = (e) => {
    const file = e.target.files[0]; // Obtém o arquivo selecionado
    const html5QrCode = new Html5Qrcode("reader"); // Cria uma instância do scanner de QR Code

    // Escaneia o arquivo e trata o resultado
    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        setQrCodeText(decodedText); // Atualiza o estado com o texto do código QR lido
      })
      .catch(err => {
        console.error("Erro ao escanear o arquivo: ", err); // Registra erro no console
      })
      .finally(() => {
        html5QrCode.clear().catch(err => console.error("Falha ao limpar o scanner de QR Code.", err)); // Limpa o scanner após a leitura do arquivo
      });
  };

  // Retorna o JSX do componente de scanner de QR Code
  return (
    <div className="box">
      <div id="reader"></div>

      <input type="file" accept="image/*" onChange={handleFileInputChange} style={{ display: "none" }} />

      {/* Botões para selecionar a fonte do código QR */}
      <div className="button-container">
        <button onClick={handleStartCamera} disabled={isCameraActive}>Selecionar NFE</button>
        <button onClick={() => document.querySelector('input[type="file"]').click()} disabled={isCameraActive}>Selecionar arquivo</button>
      </div>

      {/* Campo para inserir ou exibir o número da NFE */}
      <span>Número da NFE:</span>
      <input
        type="text"
        className="inputtext"
        value={qrCodeText}
        onChange={(e) => setQrCodeText(e.target.value)}
        placeholder="Insira ou leia os dados da NFE:"
      />
    </div>
  );
}

export default QRScanner;
