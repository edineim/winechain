# Cadeia de Suprimentos de Vinhos com Hyperledger Fabric 2.5
## Este projeto visa criar uma cadeia de suprimentos para a indústria vinícola, envolvendo cinco entidades-chave:

* **Viticultor**: Responsável pelo cultivo das uvas nas vinhas.
* **Produtor de Vinho**: Transforma as uvas em vinho, realizando o processo de fermentação e envelhecimento.
* **Distribuidor a Granel**: Responsável pela distribuição do vinho em grandes quantidades para outras etapas da cadeia.
* **Enchedor/Embalador**: Realiza o envase e a embalagem final do vinho.
* **Varejista**: Comercializa o vinho diretamente aos consumidores.

## Funcionamento

As transações na cadeia de suprimentos são validadas por três entidades: o **Produtor de Vinho**, o **Distribuidor a Granel** e o **Enchedor/Embalador**. Esses validadores garantem a integridade e a autenticidade dos registros.
Seu funcionamento pode ser visto: ```https://drive.google.com/file/d/16Co4s9DK_os-gjgiIelAj7ii00V2wM5Z/view?usp=drive_link```

## Tecnologia Utilizada
O projeto foi desenvolvido utilizando o **Hyperledger Fabric 2.5**, uma plataforma de blockchain empresarial. Com essa tecnologia, criamos scripts para adicionar duas organizações à rede e implementamos a cadeia de suprimentos de vinhos.

# Configuração inicial da rede

## Criando rede de teste

``` 
cd winechain/test-network
```

``` 
./network.sh down
```

``` 
./network.sh up
```

## Criando um canal

``` 
./network.sh createChannel
```

``` 
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go
```

## Iterando com a rede

``` 
export PATH=${PWD}/../bin:$PATH
```

``` 
export FABRIC_CFG_PATH=$PWD/../config/
```

```
# Environment variables for Org1

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

``` 
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
```

``` 
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'
```

``` 
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"TransferAsset","Args":["asset6","Christopher"]}'
```

``` 
# Environment variables for Org2

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
```
``` 
peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAsset","asset6"]}'
```

``` 
./network.sh down
```

# Winechain

## Criando a Rede e um Canal

``` 
cd winechain/test-network
```

``` 
./network.sh down
```

``` 
./network.sh up createChannel -c channel1 -ca -s couchdb
```
## Adicionando Organizações

```
cd addOrg3
./addOrg3.sh up -c channel1 -ca -s couchdb
```

```
cd ../addOrg4
./addOrg4.sh up -c channel1 -ca -s couchdb
```

## Executando a asset-transfer-events

```
cd ..
./network.sh deployCC_ch1 -ccn events -ccp ../asset-transfer-events/chaincode-javascript/ -ccl javascript -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer','Org4MSP.peer')"
```

```
cd ../asset-transfer-events/application-javascript/
npm install
```

# Iniciar Produtor de Vinho

``` 
node serverOrgs.js 3040
```

# Iniciar Distribuidor 

``` 
node serverOrgs.js 3050
```

# Iniciar Atacadista

``` 
node serverOrgs.js 3060
```

# Iniciar Varejista

``` 
node serverOrgs.js 3070
```

# Iniciar Leitura de Ledger

``` 
node ledger.js 3080
```

## Uso

A API oferece endpoints para cada estágio da produção de vinho. Use o Postman ou qualquer cliente HTTP para enviar solicitações para os seguintes endpoints:

1. **Produtor de Vinho:**

    - Método: `POST`
    - URL: `http://localhost:3040/api/produtor-vinho`
    - Corpo da solicitação (JSON):

        ```json
        {
          "NomeViticultor": "João da Silva",
          "EnderecoViticultor": "Fazenda Silva, Vinhedo, SP",
          "VariedadeUva": "Cabernet Sauvignon",
          "DataColheita": "2023-09-15",
          "NomeProdutorVinho": "Vinhos do Vale",
          "EnderecoProdutorVinho": "Estrada do Vinho, 456, Vinhedo, SP",
          "Lote": "A123",
          "IDRemessa": "PV2023-001",
          "DataEmbarque": "2023-10-01",
          "HoraEmbarque": "14:30"
        }
        ```

3. **Distribuidor:**

    - Método: `POST`
    - URL: `http://localhost:3050/api/distribuidor`
    - Corpo da solicitação (JSON):

        ```json
        {
          "NomeDistribuidor": "Distribuidora Vinífera",
          "Endereco": " Av. dos Vinhos, 789, Distribuicidade, SP",
          "Lote": "A123",
          "IDRemessa": "DV2023-001",
          "DataEmbarque": "2023-10-02",
          "HoraEmbarque": "10:45"
        }
        ```

4. **Atacadista:**

    - Método: `POST`
    - URL: `http://localhost:3060/api/atacadista`
    - Corpo da solicitação (JSON):

        ```json
        {
          "NomeAtacadista": "Atacado dos Vinhos",
          "EnderecoAtacadista": "Rua das Garrafas, 101, Atacadópolis, SP",
          "IDRemessaAtacadista": "AV2023-001",
          "DataRecebimentoAtacadista": "2023-10-03",
          "HoraRecebimentoAtacadista": "08:15",
          "QuantidadeRecebidaAtacadista": "500 caixas"
        }
        ```

5. **Varejista:**

    - Método: `POST`
    - URL: `http://localhost:3070/api/varejista`
    - Corpo da solicitação (JSON):

        ```json
        {
          "NomeVarejista": "Vinhos & Mais",
          "Endereco": "Praça da Taça, 7, Varejo City, SP",
          "Lote": "A123",
          "DataVenda": "2023-07-01",
          "IDRemessa": "VR2023-001",
          "DataEmbarque": "17:30",
          "HoraEmbarque": "11:20"
        }
        ```
        
## Encerrando o Servidor

Para encerrar o servidor, pressione `Ctrl + C` no terminal onde o servidor está sendo executado.
















