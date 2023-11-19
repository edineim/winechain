// app.js

let viticultorTransaction;
let producerTransaction;
let distributorTransaction;
let fillerPackerTransaction;
let retailerTransaction;

// Função para processar dados do viticultor
function dados_viticultor(NomeViticultor, Endereco, VariedadeUva, DataHarvest) {
  viticultorTransaction = {
    EntityType: 'Viticultor',
    Name: NomeViticultor,
    Address: Endereco,
    GrapeVariety: VariedadeUva,
    HarvestDate: DataHarvest,
  };
  console.log('Viticultor Transaction:', viticultorTransaction);
}

// Função para processar dados do produtor de vinho
function dados_produtor_de_vinho(NomeProdutor, Endereco, Lote, DataCrush, HoraCrush, VariedadeUva) {
  producerTransaction = {
    EntityType: 'Producer',
    Name: NomeProdutor,
    Address: Endereco,
    LotNumber: Lote,
    CrushDate: DataCrush,
    CrushTime: HoraCrush,
    GrapeVariety: VariedadeUva,
  };
  console.log('Produtor de Vinho Transaction:', producerTransaction);
}

// Função para processar dados do distribuidor a granel
function dados_distribuidor_agranel(NomeDistribuidor, Endereco, IDRemessa, DataEmbarque, HoraEmbarque) {
  distributorTransaction = {
    EntityType: 'Distributor',
    Name: NomeDistribuidor,
    Address: Endereco,
    ShipmentID: IDRemessa,
    ShipmentDate: DataEmbarque,
    ShipmentTime: HoraEmbarque,
  };
  console.log('Distribuidor Transaction:', distributorTransaction);
}

// Função para processar dados do enchedor/embalador
function dados_enchedor_embalador(NomeEnchedorEmbalador, Endereco, NumeroLote, DataEnchimentoEmbalagem, HorarioEnchimentoEmbalagem) {
  fillerPackerTransaction = {
    EntityType: 'FillerPacker',
    Name: NomeEnchedorEmbalador,
    Address: Endereco,
    LotNumberBottle: NumeroLote,
    FillPackDate: DataEnchimentoEmbalagem,
    FillPackTime: HorarioEnchimentoEmbalagem,
  };
  console.log('Enchedor/Embalador Transaction:', fillerPackerTransaction);
}

// Função para processar dados do varejista
function dados_varejista(NomeVarejista, Endereco, DataVenda, HorarioVenda, Quantidade) {
  retailerTransaction = {
    EntityType: 'Retailer',
    Name: NomeVarejista,
    Address: Endereco,
    SaleDate: DataVenda,
    SaleTime: HorarioVenda,
    QuantitySold: Quantidade,
  };
  console.log('Varejista Transaction:', retailerTransaction);
}

module.exports = {
  dados_viticultor,
  dados_produtor_de_vinho,
  dados_distribuidor_agranel,
  dados_enchedor_embalador,
  dados_varejista,
  getViticultorTransaction: () => viticultorTransaction,
  getProducerTransaction: () => producerTransaction,
  getDistributorTransaction: () => distributorTransaction,
  getFillerPackerTransaction: () => fillerPackerTransaction,
  getRetailerTransaction: () => retailerTransaction,
};
