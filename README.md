# Cadeia de Suprimentos de Vinhos com Hyperledger Fabric 2.5
## Este projeto visa criar uma cadeia de suprimentos para a indústria vinícola, envolvendo cinco entidades-chave:

* **Produtor de Vinho**: coleta as informações da colheita das uvas com o viticultor, transforma as uvas em vinho, enche e embala o vinho em garrafas e fornece informações sobre o processo.
* **Distribuidor a Granel**: transporta o vinho do produtor de vinho para o atacadista.
* **Varejista**: recebe paletes e caixas de vinho do distribuidor de produtos acabados e os despacha para as lojas de varejo.
* **Atacadista**:  vende o vinho ao consumidor final e fornece informações sobre a venda. 

## Funcionamento

As transações na cadeia de suprimentos são validadas por quatro entidades: **Produtor de Vinho**, **Distribuidor a Granel**, **Varejista** e o **Atacadista**.

![Texto Alternativo](https://github.com/edineim/winechain/raw/master/imagens/entidades.JPG)

## Arquitetura

Quatro organizações, R1, R2, R3 e R4, juntamente com o serviço de pedido do canal, R0, concordam em estabelecer uma rede, N. Esta rede possui uma configuração CC1, com a qual todas as organizações concordam e que lista a definição das organizações, bem como as políticas que definem os papéis que cada organização desempenhará no canal.

Neste canal, R1, R2, R3 e R4 unem pares, denominados P1, P2, P3 e P4, ao canal C1, enquanto R0 possui O, o serviço de pedido do canal. Todos esses nós contêm uma cópia do razão (L1) do canal, onde as transações são registradas e o chaincode (S) instalado, embora as organizações não sejam obrigadas a instalar todos os chaincodes. R1, R2, R3, R4 e R0 também interagem com o canal através dos aplicativos A1, A2, A3 e A4, de sua propriedade. Todas as cinco organizações, mais o serviço de pedido, possuem uma Autoridade de Certificação (CA) que gera os certificados necessários para os nós, administradores, definições de organizações e aplicativos de sua organização.

![Texto Alternativo](https://github.com/edineim/winechain/raw/master/imagens/rede.JPG)

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

``` 
node app.js
```
## Uso

A API oferece endpoints para cada estágio da produção de vinho. Use o Postman ou qualquer cliente HTTP para enviar solicitações para os seguintes endpoints:

1. **Viticultor:**

    - Método: `POST`
    - URL: `http://localhost:3000/api/viticultor`
    - Corpo da solicitação (JSON):

        ```json
        {
          "Name": "Winery Estate",
          "Address": "123 Vineyard Lane, Napa Valley, CA",
          "GrapeVariety": "Chardonnay",
          "HarvestDate": "2023-01-15"
        }
        ```

2. **Produtor de Vinho:**

    - Método: `POST`
    - URL: `http://localhost:3000/api/produtor-vinho`
    - Corpo da solicitação (JSON):

        ```json
        {
          "ProducerName": "WineCrafters Inc.",
          "ProducerAddress": "456 Wine Road, Sonoma, CA",
          "LotNumber": "WC001",
          "CrushDate": "2023-02-01",
          "CrushTime": "10:00",
          "GrapeVariety": "Chardonnay"
        }
        ```

3. **Distribuidor a Granel:**

    - Método: `POST`
    - URL: `http://localhost:3000/api/distribuidor`
    - Corpo da solicitação (JSON):

        ```json
        {
          "DistributorName": "Grape Logistics",
          "DistributorAddress": "789 Distribution Boulevard, San Francisco, CA",
          "ShipmentID": "GL001",
          "ShipmentDate": "2023-02-15",
          "ShipmentTime": "14:00"
        }
        ```

4. **Enchedor/Embalador:**

    - Método: `POST`
    - URL: `http://localhost:3000/api/enchedor-embalador`
    - Corpo da solicitação (JSON):

        ```json
        {
          "FillerPackerName": "Bottle & Cork",
          "FillerPackerAddress": "101 Packaging Way, Napa, CA",
          "LotNumberBottle": "BC001",
          "FillPackDate": "2023-02-18",
          "FillPackTime": "11:30"
        }
        ```

5. **Varejista:**

    - Método: `POST`
    - URL: `http://localhost:3000/api/varejista`
    - Corpo da solicitação (JSON):

        ```json
        {
          "RetailerName": "Wine Emporium",
          "RetailerAddress": "543 Wine Street, San Francisco, CA",
          "SaleDate": "2023-03-01",
          "SaleTime": "18:00",
          "QuantitySold": 100
        }
        ```

6. **Histórico de Transações:**

    - Método: `GET`
    - URL: `http://localhost:3000/api/historico-transacoes`

## Encerrando o Servidor

Para encerrar o servidor, pressione `Ctrl + C` no terminal onde o servidor está sendo executado.

# Substituir elemento em todos os arquivos presentes

```
for file in `grep -R org4 | awk '{print $1}' | cut -d: -f1 | sort | uniq`
do 
    sed -i 's/org4/org5/g' $file
done
```
















