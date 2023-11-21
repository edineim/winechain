// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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
  // main(producerTransaction, 'Producer');  // Chame a função 'main' com a entidade 'Producer'

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


if (port === '3040') {
  entidade = 'Produtor de vinho';
} else if (port === '3050') {
  entidade = 'Distribuidor';
} else if (port === '3060') {
  entidade = 'Varejista';
} else if (port === '3070') {
  entidade = 'Consulta';
}

// Iniciar o servidor
app.listen(port, () => {
  console.log(`${entidade} está rodando em http://localhost:${port}`);
});