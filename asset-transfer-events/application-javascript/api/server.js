// server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Importa as funções do app.js
const { 
  dados_viticultor,
  dados_produtor_de_vinho,
  dados_distribuidor_agranel,
  dados_enchedor_embalador,
  dados_varejista,
} = require('./app');

app.use(bodyParser.json());

// Endpoint para o Viticultor
app.post('/api/viticultor', (req, res) => {
  const { NomeViticultor, Endereco, VariedadeUva, DataHarvest } = req.body;
  dados_viticultor(NomeViticultor, Endereco, VariedadeUva, DataHarvest);
  res.json({ message: 'Solicitação do Viticultor recebida com sucesso!', data: { NomeViticultor, Endereco, VariedadeUva, DataHarvest } });
});

// Endpoint para o Produtor de Vinho
app.post('/api/produtor-vinho', (req, res) => {
  const { NomeProdutor, Endereco, Lote, DataCrush, HoraCrush, VariedadeUva } = req.body;
  dados_produtor_de_vinho(NomeProdutor, Endereco, Lote, DataCrush, HoraCrush, VariedadeUva);
  res.json({ message: 'Solicitação do Produtor de Vinho recebida com sucesso!', data: { NomeProdutor, Endereco, Lote, DataCrush, HoraCrush, VariedadeUva } });
});

// Endpoint para o Distribuidor a Granel
app.post('/api/distribuidor', (req, res) => {
  const { NomeDistribuidor, Endereco, IDRemessa, DataEmbarque, HoraEmbarque } = req.body;
  dados_distribuidor_agranel(NomeDistribuidor, Endereco, IDRemessa, DataEmbarque, HoraEmbarque);
  res.json({ message: 'Solicitação do Distribuidor recebida com sucesso!', data: { NomeDistribuidor, Endereco, IDRemessa, DataEmbarque, HoraEmbarque } });
});

// Endpoint para o Enchedor/Embalador
app.post('/api/enchedor-embalador', (req, res) => {
  const { NomeEnchedorEmbalador, Endereco, NumeroLote, DataEnchimentoEmbalagem, HorarioEnchimentoEmbalagem } = req.body;
  dados_enchedor_embalador(NomeEnchedorEmbalador, Endereco, NumeroLote, DataEnchimentoEmbalagem, HorarioEnchimentoEmbalagem);
  res.json({ message: 'Solicitação do Enchedor/Embalador recebida com sucesso!', data: { NomeEnchedorEmbalador, Endereco, NumeroLote, DataEnchimentoEmbalagem, HorarioEnchimentoEmbalagem } });
});

// Endpoint para o Varejista
app.post('/api/varejista', (req, res) => {
  const { NomeVarejista, Endereco, DataVenda, HorarioVenda, Quantidade } = req.body;
  dados_varejista(NomeVarejista, Endereco, DataVenda, HorarioVenda, Quantidade);
  res.json({ message: 'Solicitação do Varejista recebida com sucesso!', data: { NomeVarejista, Endereco, DataVenda, HorarioVenda, Quantidade } });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
