# Configuração inicial da rede

## Criando rede de teste

``` 
cd fabric-samples/test-network
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
cd fabric-samples/test-network
```

``` 
./network.sh down
```

``` 
./network.sh up createChannel -c mychannel -ca
```
## Adicionando Organizações

```
cd addOrg3
./addOrg3.sh up -c mychannel -ca
```

```
cd ../addOrg4
./addOrg4.sh up -c mychannel -ca
```

```
cd ../addOrg5
./addOrg5.sh up -c mychannel -ca
```

## Executando a asset-transfer-events

```
cd ..
./network.sh deployCC -ccn events -ccp ../asset-transfer-events/chaincode-javascript/ -ccl javascript -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer','Org4MSP.peer','Org5MSP.peer')"
```

```
cd ../../asset-transfer-events/application-javascript/
npm install
rm -rf wallet
```

``` 
node app.js
```
















