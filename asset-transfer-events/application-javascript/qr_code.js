const express = require('express');
const QRCode = require('qrcode');
const app = express();
const port = 3000;

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
  app.get('/qrcode', async (req, res) => {
    const dados = 'http://localhost:3080/api/historico/item-001';

    try {
      // Gera o QR code a partir dos dados
      const qrCodeDataUrl = await generateQRCode(JSON.stringify(dados));

      // Exibe o QR code na resposta
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Blockchain na Cadeia de Suprimentos</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              text-align: center;
            }

            h1 {
              color: #333;
            }

            p {
              color: #666;
              margin-bottom: 15px;
            }

            img {
              max-width: 100%;
              height: auto;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Histórico da Cadeia de Suprimentos</h1>
          <p>Este QR Code contém informações sobre o histórico da cadeia de suprimentos de sua garrafa de vinho.</p>
          <img src="${qrCodeDataUrl}" alt="QR Code">
          <p>Escaneie o QR Code para visualizar o histórico completo na blockchain.</p>
          <p>Este sistema utiliza a tecnologia blockchain para garantir a integridade e transparência das informações ao longo da cadeia de suprimentos.</p>
        </body>
        </html>
      `.trim());
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
