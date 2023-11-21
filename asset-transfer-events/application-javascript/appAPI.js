'use strict';

// use this to set logging, must be set before the require('fabric-network');
process.env.HFC_LOGGING = '{"debug": "./debug.log"}';

const { Gateway, Wallets } = require('fabric-network');
const EventStrategies = require('fabric-network/lib/impl/event/defaulteventhandlerstrategies');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');

const { buildCCPOrg1, buildCCPOrg2, buildCCPOrg3, buildCCPOrg4, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'channel1';
const chaincodeName = 'events';

const org1 = 'Org1MSP';
const Org1UserId = 'appUser1';

const org2 = 'Org2MSP';
const Org2UserId = 'appUser2';

const org3 = 'Org3MSP';
const Org3UserId = 'appUser3';

const org4 = 'Org4MSP';
const Org4UserId = 'appUser4';

const RED = '\x1b[31m\n';
const GREEN = '\x1b[32m\n';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

const prompt = require('prompt-sync')();

let primeira_exe = false;

const assetKeysFilePath = path.join(__dirname, 'assetKeys.json');
const assetKeys = loadAssetKeys();

function loadAssetKeys() {
	try {
	  if (!fs.existsSync(assetKeysFilePath)) {
		saveAssetKeys([]); // Cria o arquivo se não existir
		return [];
	  }
  
	  const data = fs.readFileSync(assetKeysFilePath, 'utf8');
	  return JSON.parse(data);
	} catch (error) {
	  console.error(`Erro ao carregar as chaves de ativos: ${error}`);
	  return [];
	}
  }

function saveAssetKeys(keys) {
	const data = JSON.stringify(keys);
	fs.writeFileSync(assetKeysFilePath, data, 'utf8'); 

} 

/**
 * Perform a sleep -- asynchronous wait
 * @param ms the time in milliseconds to sleep for
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initGatewayForOrg1(useCommitEvents) {
	console.log(`${GREEN}--> Fabric client user & Gateway init: Using Org1 identity to Org1 Peer${RESET}`);
	// build an in memory object with the network configuration (also known as a connection profile)
	const ccpOrg1 = buildCCPOrg1();

	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caOrg1Client = buildCAClient(FabricCAServices, ccpOrg1, 'ca.org1.example.com');

	// setup the wallet to cache the credentials of the application user, on the app server locally
	const walletPathOrg1 = path.join(__dirname, 'wallet', 'org1');
	const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);

	// in a real application this would be done on an administrative flow, and only once
	// stores admin identity in local wallet, if needed
	await enrollAdmin(caOrg1Client, walletOrg1, org1);
	// register & enroll application user with CA, which is used as client identify to make chaincode calls
	// and stores app user identity in local wallet
	// In a real application this would be done only when a new user was required to be added
	// and would be part of an administrative flow
	await registerAndEnrollUser(caOrg1Client, walletOrg1, org1, Org1UserId, 'org1.department1');

	try {
		// Create a new gateway for connecting to Org's peer node.
		const gatewayOrg1 = new Gateway();

		if (useCommitEvents) {
			await gatewayOrg1.connect(ccpOrg1, {
				wallet: walletOrg1,
				identity: Org1UserId,
				discovery: { enabled: true, asLocalhost: true }
			});
		} else {
			await gatewayOrg1.connect(ccpOrg1, {
				wallet: walletOrg1,
				identity: Org1UserId,
				discovery: { enabled: true, asLocalhost: true },
				eventHandlerOptions: EventStrategies.NONE
			});
		}


		return gatewayOrg1;
	} catch (error) {
		console.error(`Error in connecting to gateway for Org1: ${error}`);
		process.exit(1);
	}
}

async function initGatewayForOrg2(useCommitEvents) {
	console.log(`${GREEN}--> Fabric client user & Gateway init: Using Org2 identity to Org2 Peer${RESET}`);
	// build an in memory object with the network configuration (also known as a connection profile)
	const ccpOrg2 = buildCCPOrg2();

	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caOrg2Client = buildCAClient(FabricCAServices, ccpOrg2, 'ca.org2.example.com');

	// setup the wallet to cache the credentials of the application user, on the app server locally
	const walletPathOrg2 = path.join(__dirname, 'wallet', 'org2');
	const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);

	// in a real application this would be done on an administrative flow, and only once
	// stores admin identity in local wallet, if needed
	await enrollAdmin(caOrg2Client, walletOrg2, org2);
	// register & enroll application user with CA, which is used as client identify to make chaincode calls
	// and stores app user identity in local wallet
	// In a real application this would be done only when a new user was required to be added
	// and would be part of an administrative flow
	await registerAndEnrollUser(caOrg2Client, walletOrg2, org2, Org2UserId, 'org2.department1');

	try {
		// Create a new gateway for connecting to Org's peer node.
		const gatewayOrg2 = new Gateway();

		if (useCommitEvents) {
			await gatewayOrg2.connect(ccpOrg2, {
				wallet: walletOrg2,
				identity: Org2UserId,
				discovery: { enabled: true, asLocalhost: true }
			});
		} else {
			await gatewayOrg2.connect(ccpOrg2, {
				wallet: walletOrg2,
				identity: Org2UserId,
				discovery: { enabled: true, asLocalhost: true },
				eventHandlerOptions: EventStrategies.NONE
			});
		}


		return gatewayOrg2;
	} catch (error) {
		console.error(`Error in connecting to gateway for Org2: ${error}`);
		process.exit(1);
	}
}

async function initGatewayForOrg3(useCommitEvents) {
	console.log(`${GREEN}--> Fabric client user & Gateway init: Using Org3 identity to Org3 Peer${RESET}`);
	// build an in memory object with the network configuration (also known as a connection profile)
	const ccpOrg3 = buildCCPOrg3();

	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caOrg3Client = buildCAClient(FabricCAServices, ccpOrg3, 'ca.org3.example.com');

	// setup the wallet to cache the credentials of the application user, on the app server locally
	const walletPathOrg3 = path.join(__dirname, 'wallet', 'org3');
	const walletOrg3 = await buildWallet(Wallets, walletPathOrg3);

	// in a real application this would be done on an administrative flow, and only once
	// stores admin identity in local wallet, if needed
	await enrollAdmin(caOrg3Client, walletOrg3, org3);
	// register & enroll application user with CA, which is used as client identify to make chaincode calls
	// and stores app user identity in local wallet
	// In a real application this would be done only when a new user was required to be added
	// and would be part of an administrative flow
	await registerAndEnrollUser(caOrg3Client, walletOrg3, org3, Org3UserId, 'org3.department1');

	try {
		// Create a new gateway for connecting to Org's peer node.
		const gatewayOrg3 = new Gateway();

		if (useCommitEvents) {
			await gatewayOrg3.connect(ccpOrg3, {
				wallet: walletOrg3,
				identity: Org3UserId,
				discovery: { enabled: true, asLocalhost: true }
			});
		} else {
			await gatewayOrg3.connect(ccpOrg3, {
				wallet: walletOrg3,
				identity: Org3UserId,
				discovery: { enabled: true, asLocalhost: true },
				eventHandlerOptions: EventStrategies.NONE
			});
		}


		return gatewayOrg3;
	} catch (error) {
		console.error(`Error in connecting to gateway for Org3: ${error}`);
		process.exit(1);
	}
}

async function initGatewayForOrg4(useCommitEvents) {
	console.log(`${GREEN}--> Fabric client user & Gateway init: Using Org4 identity to Org4 Peer${RESET}`);
	// build an in memory object with the network configuration (also known as a connection profile)
	const ccpOrg4 = buildCCPOrg4();

	// build an instance of the fabric ca services client based on
	// the information in the network configuration
	const caOrg4Client = buildCAClient(FabricCAServices, ccpOrg4, 'ca.org4.example.com');

	// setup the wallet to cache the credentials of the application user, on the app server locally
	const walletPathOrg4 = path.join(__dirname, 'wallet', 'org4');
	const walletOrg4 = await buildWallet(Wallets, walletPathOrg4);

	// in a real application this would be done on an administrative flow, and only once
	// stores admin identity in local wallet, if needed
	await enrollAdmin(caOrg4Client, walletOrg4, org4);
	// register & enroll application user with CA, which is used as client identify to make chaincode calls
	// and stores app user identity in local wallet
	// In a real application this would be done only when a new user was required to be added
	// and would be part of an administrative flow
	await registerAndEnrollUser(caOrg4Client, walletOrg4, org4, Org4UserId, 'org4.department1');

	try {
		// Create a new gateway for connecting to Org's peer node.
		const gatewayOrg4 = new Gateway();

		if (useCommitEvents) {
			await gatewayOrg4.connect(ccpOrg4, {
				wallet: walletOrg4,
				identity: Org4UserId,
				discovery: { enabled: true, asLocalhost: true }
			});
		} else {
			await gatewayOrg4.connect(ccpOrg4, {
				wallet: walletOrg4,
				identity: Org4UserId,
				discovery: { enabled: true, asLocalhost: true },
				eventHandlerOptions: EventStrategies.NONE
			});
		}


		return gatewayOrg4;
	} catch (error) {
		console.error(`Error in connecting to gateway for Org4: ${error}`);
		process.exit(1);
	}
}

function checkAsset(org, resultBuffer, color, size, owner, appraisedValue, price) {
	console.log(`${GREEN}<-- Query results from ${org}${RESET}`);

	let asset;
	if (resultBuffer) {
		asset = JSON.parse(resultBuffer.toString('utf8'));
	} else {
		console.log(`${RED}*** Failed to read asset${RESET}`);
	}
	console.log(`*** verify asset ${asset.ID}`);

	if (asset) {
		// if (asset.Color === color) {
		// 	console.log(`*** asset ${asset.ID} has color ${asset.Color}`);
		// } else {
		// 	console.log(`${RED}*** asset ${asset.ID} has color of ${asset.Color}${RESET}`);
		// }
		// if (asset.Size === size) {
		// 	console.log(`*** asset ${asset.ID} has size ${asset.Size}`);
		// } else {
		// 	console.log(`${RED}*** Failed size check from ${org} - asset ${asset.ID} has size of ${asset.Size}${RESET}`);
		// }
		// if (asset.Owner === owner) {
		// 	console.log(`*** asset ${asset.ID} owned by ${asset.Owner}`);
		// } else {
		// 	console.log(`${RED}*** Failed owner check from ${org} - asset ${asset.ID} owned by ${asset.Owner}${RESET}`);
		// }
		if (asset.AppraisedValue === appraisedValue) {
			console.log(`*** asset ${asset.ID} has appraised value:`);

			// Converter a string JSON para um objeto JavaScript
			var wineData = JSON.parse(asset.AppraisedValue);

			// Loop através das propriedades do objeto e exibir de forma dinâmica
			for (var prop in wineData) {
			if (wineData.hasOwnProperty(prop)) {
				console.log("	 - " + prop + ": " + wineData[prop]);
			}
			}

		} else {
			console.log(`${RED}*** Failed appraised value check from ${org} - asset ${asset.ID} has appraised value of ${asset.AppraisedValue}${RESET}`);
		}
		// if (price) {
		// 	if (asset.asset_properties && asset.asset_properties.Price === price) {
		// 		console.log(`*** asset ${asset.ID} has price ${asset.asset_properties.Price}`);
		// 	} else {
		// 		console.log(`${RED}*** Failed price check from ${org} - asset ${asset.ID} has price of ${asset.asset_properties.Price}${RESET}`);
		// 	}
		// }
	}
}

function showTransactionData(transactionData) {
	const creator = transactionData.actions[0].header.creator;
	console.log(`    - submitted by: ${creator.mspid}-${creator.id_bytes.toString('hex')}`);
	for (const endorsement of transactionData.actions[0].payload.action.endorsements) {
		console.log(`    - endorsed by: ${endorsement.endorser.mspid}-${endorsement.endorser.id_bytes.toString('hex')}`);
	}
	const chaincode = transactionData.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec;
	console.log(`    - chaincode:${chaincode.chaincode_id.name}`);
	console.log(`    - function:${chaincode.input.args[0].toString()}`);

	let entidade;

	for (let x = 1; x < chaincode.input.args.length; x++) {
		if (x === chaincode.input.args.length - 1){
			entidade = chaincode.input.args[x].toString()

			// Converter a string JSON para um objeto JavaScript
			var wineData = JSON.parse(entidade);

			// Loop através das propriedades do objeto e exibir de forma dinâmica
			for (var prop in wineData) {
			if (wineData.hasOwnProperty(prop)) {
				console.log("	 - " + prop + ": " + wineData[prop]);
			}
			}
		}
		else if (x === 1){
			console.log(`    - arg:${chaincode.input.args[x].toString()}`);
		}
		
	}
}

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
	main(viticultorTransaction, viticultorTransaction.EntityType);
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
	main(producerTransaction, producerTransaction.EntityType);
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
	main(distributorTransaction, distributorTransaction.EntityType);
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
	main(fillerPackerTransaction, fillerPackerTransaction.EntityType);
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
	main(retailerTransaction, retailerTransaction.EntityType);
  }

async function createTransaction(contract, assetKey, endorsingOrg, org1, dados, nome_da_entidade) {
    try {
        console.log(`${GREEN}--> Submit Transaction: CreateAsset, ${assetKey} Cria ${nome_da_entidade} ${RESET}`);

        const transaction = contract.createTransaction('CreateAsset');

        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const assetProperties = {
            object_type: 'asset_properties',
            asset_id: assetKey,
            salt: Buffer.from(randomNumber.toString()).toString('hex')
        };
        const assetPropertiesString = JSON.stringify(assetProperties);

        transaction.setTransient({
            asset_properties: Buffer.from(assetPropertiesString)
        });

        transaction.setEndorsingOrganizations(endorsingOrg);

		const entityData = { nome_da_entidade, assetKeys: [assetKey] };
		assetKeys.push(entityData);
		saveAssetKeys(assetKeys);

        await transaction.submit(assetKey, 'blue', '10', 'Sam', JSON.stringify(dados));
        console.log(`${GREEN}<-- Submit CreateAsset Result: committed, asset ${assetKey}${RESET}`);
        await sleep(5000);

        console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey}, Le ${nome_da_entidade} ${RESET}`);
        const resultBuffer = await contract.evaluateTransaction('ReadAsset', assetKey);
        checkAsset(org1, resultBuffer, 'blue', '10', 'Sam', JSON.stringify(dados));
    } catch (error) {
        console.log(`${RED}<-- Failed: CreateAsset - ${error}${RESET}`);
    }
}

function loadAssetKeys() {
	try {
	  const data = fs.readFileSync('assetKeys.json');
	  return JSON.parse(data);
	} catch (error) {
	  	console.log('Error', error);
	  return [];
	}
  }

async function readAssetKeys(contract, org1) {
	const assetKeys = loadAssetKeys();
	if (assetKeys.length === 0) {
		console.log(`${YELLOW}Nenhum item encontrado em assetkeys.json.${RESET}`);
		return;
	}

	console.log(`${YELLOW}Conteúdo de assetkeys.json:${RESET}`);
	for (const entity of assetKeys) {
		console.log(`${GREEN}Nome da Entidade: ${entity.nome_da_entidade}${RESET}`);
		console.log(`${GREEN}AssetKeys:`);
		for (const key of entity.assetKeys) {
			console.log(`  ${key}`);			

			console.log(`${GREEN}--> Evaluate: ReadAsset, - ${key}, Le ${entity.nome_da_entidade}${RESET}`);
			const resultBuffer = await contract.evaluateTransaction('ReadAsset', key);
			checkAsset(org1, resultBuffer, 'blue', '10', 'Sam', JSON.stringify(entity));
		
		}
	}
}


async function main(dataTransaction, nome_da_entidade) {
	console.log(`${BLUE} **** START ****${RESET}`);
	try {
		// const gateway1Org1 = await initGatewayForOrg1(true); 


		let transaction;
		let listener;

		// const network1Org1 = await gateway1Org1.getNetwork(channelName);
		// const contract1Org1 = network1Org1.getContract(chaincodeName);

		// contract1Org1.removeContractListener(listener);

		const gateway2Org1 = await initGatewayForOrg1(); // Org1
		const network2Org1 = await gateway2Org1.getNetwork(channelName);
		const contract2Org1 = network2Org1.getContract(chaincodeName);

		// const gatewayOrg1 = await initGatewayForOrg1(true); // transaction handling uses commit events
		// const gatewayOrg2 = await initGatewayForOrg2(true);
		// const gatewayOrg3 = await initGatewayForOrg3(true);
		// const gatewayOrg4 = await initGatewayForOrg4(true);

		// const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
		// const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
		// const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
		// const networkOrg4 = await gatewayOrg4.getNetwork(channelName);

		// const contractOrg1 = networkOrg1.getContract(chaincodeName);
		// const contractOrg2 = networkOrg2.getContract(chaincodeName);
		// const contractOrg3 = networkOrg3.getContract(chaincodeName);
		// const contractOrg4 = networkOrg4.getContract(chaincodeName);


		let randomNumber;
		let assetKey;

		let firstBlock = true; // simple indicator to track blocks

		try {
			let listener;

			// create a block listener
			listener = async (event) => {
				const transEvents = event.getTransactionEvents();
				if (primeira_exe){
					console.log(`${GREEN}<-- Block Event Received - block number: ${event.blockNumber.toString()}${RESET}`);
					for (const transEvent of transEvents) {
						console.log(`*** transaction event: ${transEvent.transactionId}`);
						if (transEvent.privateData) {
							for (const namespace of transEvent.privateData.ns_pvt_rwset) {
								console.log(`    - private data: ${namespace.namespace}`);
								for (const collection of namespace.collection_pvt_rwset) {
									console.log(`     - collection: ${collection.collection_name}`);
									if (collection.rwset.reads) {
										for (const read of collection.rwset.reads) {
											console.log(`       - read set - ${BLUE}key:${RESET} ${read.key}  ${BLUE}value:${read.value.toString()}`);
										}
									}
									if (collection.rwset.writes) {
										for (const write of collection.rwset.writes) {
											console.log(`      - write set - ${BLUE}key:${RESET}${write.key} ${BLUE}is_delete:${RESET}${write.is_delete} ${BLUE}value:${RESET}${write.value.toString()}`);
										}
									}
								}
							}
						}
						if (transEvent.transactionData) {
							showTransactionData(transEvent.transactionData);
						}
					}
				}
			};

			await network2Org1.addBlockListener(listener, {type: 'private'});

			primeira_exe = true;	
			randomNumber = Math.floor(Math.random() * 1000) + 1;
			assetKey = `item-${randomNumber}`;

			await createTransaction(contract2Org1, assetKey, org4, org1, dataTransaction, nome_da_entidade);

			network2Org1.removeBlockListener(listener);			

		} catch (runError) {
			console.error(`Error in transaction: ${runError}`);
			if (runError.stack) {
				console.error(runError.stack);
			}
		}
	} catch (error) {
		console.error(`Error in setup: ${error}`);
		if (error.stack) {
			console.error(error.stack);
		}
		process.exit(1);
	}

	await sleep(5000);
	console.log(`${BLUE} **** END ****${RESET}`);
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