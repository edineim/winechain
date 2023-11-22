// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const QRCode = require('qrcode'); 
const port = process.argv[2];

// Importa as funções do app.js
const { 
  dados_produtor_de_vinho,
  dados_distribuidor,
  dados_varejista,
} = require('./appAPI_AllOrg');

app.use(bodyParser.json());

// Inicialize producerTransaction como um objeto vazio
let producerTransaction = {};

app.post('/api/produtor-vinho', (req, res) => {
  const { 
    NomeViticultor, 
    EnderecoViticultor, 
    VariedadeUva, 
    DataColheita, 
    NomeProdutorDistribuidor, 
    EnderecoProdutorDistribuidor, 
    Lote, 
    IDRemessa, 
    DataEmbarque, 
    HoraEmbarque 
  } = req.body;

  // Se 'Viticultor' não existir, crie um array vazio
  if (!producerTransaction.Viticultor) {
    producerTransaction.Viticultor = [];
  }

  // Adicione um novo objeto de viticultor ao array
  const novoViticultor = {
    NomeViticultor, 
    EnderecoViticultor, 
    VariedadeUva, 
    DataColheita
  };

  // Adicione o novo viticultor ao array 'Viticultor'
  producerTransaction.Viticultor.push(novoViticultor);

  // Adicione os outros campos à transação se estiverem presentes no corpo da requisição
  if (NomeProdutorDistribuidor !== undefined) {
    producerTransaction.NomeProdutorDistribuidor = NomeProdutorDistribuidor;
  }

  if (EnderecoProdutorDistribuidor !== undefined) {
    producerTransaction.Endereco = EnderecoProdutorDistribuidor;
  }

  if (Lote !== undefined) {
    producerTransaction.Lote = Lote;
  }

  if (IDRemessa !== undefined) {
    producerTransaction.IDRemessa = IDRemessa;
  }

  if (DataEmbarque !== undefined) {
    producerTransaction.DataEmbarque = DataEmbarque;
  }

  if (HoraEmbarque !== undefined) {
    producerTransaction.HoraEmbarque = HoraEmbarque;
  }

  console.log('Produtor de Vinho Transaction:', producerTransaction);
  dados_produtor_de_vinho(NomeViticultor, EnderecoViticultor, VariedadeUva, DataColheita, NomeProdutorDistribuidor, EnderecoProdutorDistribuidor, Lote, IDRemessa, DataEmbarque, HoraEmbarque)
  res.json({ 
    message: 'Solicitação do Produtor de Vinho recebida com sucesso!', 
    data: producerTransaction
  });
});


// Endpoint para o Distribuidor a Granel
app.post('/api/distribuidor', (req, res) => {
  const { NomeDistribuidor, Endereco, IDRemessa, DataEmbarque, HoraEmbarque } = req.body;
  dados_distribuidor(NomeDistribuidor, Endereco, IDRemessa, DataEmbarque, HoraEmbarque);
  res.json({ message: 'Solicitação do Distribuidor recebida com sucesso!', data: { NomeDistribuidor, Endereco, IDRemessa, DataEmbarque, HoraEmbarque } });
});

// Endpoint para o Varejista
app.post('/api/varejista', (req, res) => {
  const { NomeVarejista, Endereco, DataVenda, HorarioVenda, Quantidade } = req.body;
  dados_varejista(NomeVarejista, Endereco, DataVenda, HorarioVenda, Quantidade);
  res.json({ message: 'Solicitação do Varejista recebida com sucesso!', data: { NomeVarejista, Endereco, DataVenda, HorarioVenda, Quantidade } });
});


// Função para gerar QR code a partir de uma string
async function generateQRCode(data) {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    throw error;
  }
}

app.post('/api/qrcode', async (req, res) => {

  const qrcode = 'http://localhost:3080/'

  // Gera o QR code a partir dos dados da transação do produtor de vinho
  try {
    const qrCodeDataUrl = await generateQRCode(qrcode);

    // Adiciona a rota para exibir o QR code
    res.send(`<img src="${qrCodeDataUrl}" alt="QR Code">`);
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    res.status(500).send('Erro ao gerar QR code');
  }
});

if (port == 3070) {
  // Função para gerar QR code a partir de uma string
  async function generateQRCode(data) {
    try {
      return await QRCode.toDataURL(data);
    } catch (error) {
      throw error;
    }
  }

  app.get('/code', async (req, res) => {
    const dados = 'http://localhost:8080';
  
    try {
      // Gera o QR code a partir dos dados
      const qrCodeDataUrl = await generateQRCode(JSON.stringify(dados));
  
      // Envia a página HTML com o QR code incorporado
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Code Generator</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .qrcode-container {
            text-align: center;
          }

          .qrcode-img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="qrcode-container">
          <h1>QR Code Generator</h1>
          <p>Scan the QR code to access: <code>${dados}</code></p>
          <img class="qrcode-img" src="${qrCodeDataUrl}" alt="QR Code">
        </div>
      </body>
      </html>
    `);
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      res.status(500).send('Erro ao gerar QR code');
    }
  });
}


if (port === '3040') {
  entidade = 'Produtor de vinho';
} else if (port === '3050') {
  entidade = 'Distribuidor';
} else if (port === '3060') {
  entidade = 'Varejista';
} else if (port === '3070') {
  entidade = 'QRcode';
} else if (port === '3080') {
  entidade = 'Ledger';
}

// Iniciar o servidor
app.listen(port, () => {
  console.log(`${entidade} está rodando em http://localhost:${port}`);
});