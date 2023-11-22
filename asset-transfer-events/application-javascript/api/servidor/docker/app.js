const express = require('express');
const QRCode = require('qrcode');
const app = express();
let port = 3000;

if (port === 3000) {
    // Função para gerar QR code a partir de uma string
    async function generateQRCode(data) {
      try {
        return await QRCode.toDataURL(data);
      } catch (error) {
        throw error;
      }
    }

    // Rota para gerar e exibir QR code
    app.get('/', async (req, res) => {
      const dados = 'http://localhost:3080/';

      try {
        // Gera o QR code a partir dos dados
        const qrCodeDataUrl = await generateQRCode(JSON.stringify(dados));

        // Exibe o QR code na resposta
        res.send(`<img src="${qrCodeDataUrl}" alt="QR Code">`);
      } catch (error) {
        console.error('Erro ao gerar QR code:', error);
        res.status(500).send('Erro ao gerar QR code');
      }
    });
}

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor web está rodando em http://localhost:${port}`);
});
