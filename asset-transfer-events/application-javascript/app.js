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
		if (asset.Color === color) {
			console.log(`*** asset ${asset.ID} has color ${asset.Color}`);
		} else {
			console.log(`${RED}*** asset ${asset.ID} has color of ${asset.Color}${RESET}`);
		}
		if (asset.Size === size) {
			console.log(`*** asset ${asset.ID} has size ${asset.Size}`);
		} else {
			console.log(`${RED}*** Failed size check from ${org} - asset ${asset.ID} has size of ${asset.Size}${RESET}`);
		}
		if (asset.Owner === owner) {
			console.log(`*** asset ${asset.ID} owned by ${asset.Owner}`);
		} else {
			console.log(`${RED}*** Failed owner check from ${org} - asset ${asset.ID} owned by ${asset.Owner}${RESET}`);
		}
		if (asset.AppraisedValue === appraisedValue) {
			console.log(`*** asset ${asset.ID} has appraised value ${asset.AppraisedValue}`);
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

			console.log(entidade);
		}
		else if (x === 1){
			console.log(`    - arg:${chaincode.input.args[x].toString()}`);
		}
		
	}
}

function dados_viticultor() {
	const name = "John Smith Vineyards";
	const address = "1234 Main St, Napa, CA 94558";
	const grapeVariety = "Cabernet Sauvignon";
	const harvestDate = "01/10/2022";

	let viticultorTransaction;

	viticultorTransaction = {
		EntityType: 'Viticultor',
		Name: name,
		Address: address,
		GrapeVariety: grapeVariety,
		HarvestDate: harvestDate,
	};

	return viticultorTransaction;
}

function dados_produtor_de_vinho() {
	const producerName = "Vinícola Acme";
    const producerAddress = "5678 Vineyard Rd, Sonoma, CA 95476";
    const lotNumber = "ACME001";
    const crushDate = "02/10/2022";
    const crushTime = "9h00";
    const grapeVariety = "Cabernet Sauvignon";

	let producerTransaction;

    producerTransaction = {
        EntityType: 'Producer',
        Name: producerName,
        Address: producerAddress,
        LotNumber: lotNumber,
        CrushDate: crushDate,
        CrushTime: crushTime,
        GrapeVariety: grapeVariety,
    };

	return producerTransaction;
}

function dados_distribuidor_agranel(){
	const distributorName = "Grape Logistics";
    const distributorAddress = "9010 Distribution Blvd, San Francisco, CA 94103";
    const shipmentID = "GRPL001";
    const shipmentDate = "15/10/2022";
    const shipmentTime = "10h00";

	let distributorTransaction;

    distributorTransaction = {
        EntityType: 'Distributor',
        Name: distributorName,
        Address: distributorAddress,
        ShipmentID: shipmentID,
        ShipmentDate: shipmentDate,
        ShipmentTime: shipmentTime,
    };
	
	return distributorTransaction;
}

function dados_enchedor_embalador(){

	const fillerPackerName = "Garrafa e Cortiça";
    const fillerPackerAddress = "3456 Packing Way, Napa, CA 94558";
    const lotNumberBottle = "BOTTLE001";
    const fillPackDate = "18/10/2022";
    const fillPackTime = "11h00";

	let fillerPackerTransaction;

    fillerPackerTransaction = {
        EntityType: 'FillerPacker',
        Name: fillerPackerName,
        Address: fillerPackerAddress,
        LotNumberBottle: lotNumberBottle,
        FillPackDate: fillPackDate,
        FillPackTime: fillPackTime,
    };

	return fillerPackerTransaction
}

function dados_varejista(){
	const retailerName = "Wine Emporium";
    const retailerAddress = "3456 Wine St, São Francisco, CA 94110";
    const saleDate = "05/11/2022";
    const saleTime = "17h00";
    const quantitySold = 500;

	let retailerTransaction;

    retailerTransaction = {
        EntityType: 'Retailer',
        Name: retailerName,
        Address: retailerAddress,
        SaleDate: saleDate,
        SaleTime: saleTime,
        QuantitySold: quantitySold,
    };

	return retailerTransaction;
}

async function createTransaction(contract, assetKey, endorsingOrg, org1, entidade, nome_da_entidade) {
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

        await transaction.submit(assetKey, 'blue', '10', 'Sam', JSON.stringify(entidade));
        console.log(`${GREEN}<-- Submit CreateAsset Result: committed, asset ${assetKey}${RESET}`);
        await sleep(5000);

        console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey}, Le ${nome_da_entidade} ${RESET}`);
        const resultBuffer = await contract.evaluateTransaction('ReadAsset', assetKey);
        checkAsset(org1, resultBuffer, 'blue', '10', 'Sam', JSON.stringify(entidade));
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


async function main() {
	console.log(`${BLUE} **** START ****${RESET}`);
	try {
		// let randomNumber = Math.floor(Math.random() * 1000) + 1;
		// // use a random key so that we can run multiple times
		// let assetKey = `item-${randomNumber}`;

		/** ******* Fabric client init: Using Org1 identity to Org1 Peer ******* */
		const gateway1Org1 = await initGatewayForOrg1(true); // transaction handling uses commit events
		// const gateway1Org2 = await initGatewayForOrg2(true); // transaction handling uses commit events

		const gateway2Org1 = await initGatewayForOrg1(); // Org1
		// const gateway2Org1 = await initGatewayForOrg2(); // Org2
		// const gateway2Org2 = await initGatewayForOrg2();
		

		try {
			//
			//  - - - - - -  C H A I N C O D E  E V E N T S
			//
			// console.log(`${BLUE} **** CHAINCODE EVENTS ****${RESET}`);
			let transaction;
			let listener;
			let viticultorTransaction;
			let producerTransaction;
			let distributorTransaction;
			let fillerPackerTransaction;
			let retailerTransaction;

			const network1Org1 = await gateway1Org1.getNetwork(channelName);
			const contract1Org1 = network1Org1.getContract(chaincodeName);

			// try {
			// 	// first create a listener to be notified of chaincode code events
			// 	// coming from the chaincode ID "events"
			// 	listener = async (event) => {
			// 		const asset = JSON.parse(event.payload.toString());
			// 		console.log(`${GREEN}<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}${RESET}`);
			// 		// show the information available with the event
			// 		console.log(`*** Event: ${event.eventName}:${asset.ID}`);
			// 		// notice how we have access to the transaction information that produced this chaincode event
			// 		const eventTransaction = event.getTransactionEvent();
			// 		console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
			// 		showTransactionData(eventTransaction.transactionData);
			// 		// notice how we have access to the full block that contains this transaction
			// 		const eventBlock = eventTransaction.getBlockEvent();
			// 		console.log(`*** block: ${eventBlock.blockNumber.toString()}`);
			// 	};
			// 	// now start the client side event service and register the listener
			// 	console.log(`${GREEN}--> Start contract event stream to peer in Org1${RESET}`);
			// 	await contract1Org1.addContractListener(listener);
			// } catch (eventError) {
			// 	console.log(`${RED}<-- Failed: Setup contract events - ${eventError}${RESET}`);
			// }

			// try {
			// 	// CRIAR VITICULTOR
			// 	console.log(`${GREEN}--> Submit Transaction: CreateAsset, ${assetKey} owned by Sam${RESET}`);
			// 	transaction = contract1Org1.createTransaction('CreateAsset');

			// 	const name = "John Smith Vineyards";
			// 	const address = "1234 Main St, Napa, CA 94558";
			// 	const grapeVariety = "Cabernet Sauvignon";
			// 	const harvestDate = "01/10/2022";

			// 	viticultorTransaction = {
			// 		EntityType: 'Viticultor',
			// 		Name: name,
			// 		Address: address,
			// 		GrapeVariety: grapeVariety,
			// 		HarvestDate: harvestDate,
			// 	};

			// 	await transaction.submit(assetKey, 'blue', '10', 'Sam', JSON.stringify(viticultorTransaction));
			// 	console.log(`${GREEN}<-- Submit CreateAsset Result: committed, asset ${assetKey}${RESET}`);
			// } catch (createError) {
			// 	console.log(`${RED}<-- Submit Failed: CreateAsset - ${createError}${RESET}`);
			// }
			// try {
			// 	// LE VITICULTOR
			// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} should be owned by Sam${RESET}`);
			// 	const resultBuffer = await contract1Org1.evaluateTransaction('ReadAsset', assetKey);
			// 	checkAsset(org1, resultBuffer, 'blue', '10', 'Sam', JSON.stringify(viticultorTransaction));
			// } catch (readError) {
			// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
			// }

			// try {
			// 	// CRIAR PRODUTOR DE VINHO
			// 	console.log(`${GREEN}--> Submit Transaction: CreateAsset, ${assetKey} owned by Sam${RESET}`);
			// 	transaction = contract1Org1.createTransaction('CreateAsset');

			// 	const producerName = "Vinícola Acme";
			// 	const producerAddress = "5678 Vineyard Rd, Sonoma, CA 95476";
			// 	const lotNumber = "ACME001";
			// 	const crushDate = "02/10/2022";
			// 	const crushTime = "9h00";
			// 	const grapeVariety = "Cabernet Sauvignon";
			
			// 	const producerTransaction = {
			// 		EntityType: 'Producer',
			// 		Name: producerName,
			// 		Address: producerAddress,
			// 		LotNumber: lotNumber,
			// 		CrushDate: crushDate,
			// 		CrushTime: crushTime,
			// 		GrapeVariety: grapeVariety,
			// 	};

			// 	await transaction.submit(assetKey, 'blue', '10', 'Sam', JSON.stringify(producerTransaction));
			// 	console.log(`${GREEN}<-- Submit CreateAsset Result: committed, asset ${assetKey}${RESET}`);
			// } catch (createError) {
			// 	console.log(`${RED}<-- Submit Failed: CreateAsset - ${createError}${RESET}`);
			// }
			// try {
			// 	// LE PRODUTOR DE VINHO
			// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} should be owned by Sam${RESET}`);
			// 	const resultBuffer = await contract1Org1.evaluateTransaction('ReadAsset', assetKey);
			// 	checkAsset(org1, resultBuffer, 'blue', '10', 'Sam', JSON.stringify(producerTransaction));
			// } catch (readError) {
			// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
			// }


			// try {
			// 	// U P D A T E
			// 	console.log(`${GREEN}--> Submit Transaction: UpdateAsset ${assetKey} update appraised value to 200`);
			// 	transaction = contract1Org1.createTransaction('UpdateAsset');

			// 	const producerName = "Vinícola Acme";
			// 	const producerAddress = "5678 Vineyard Rd, Sonoma, CA 95476";
			// 	const lotNumber = "ACME001";
			// 	const crushDate = "02/10/2022";
			// 	const crushTime = "9h00";
			// 	const grapeVariety = "Cabernet Sauvignon";
			
			// 	const producerTransaction = {
			// 		EntityType: 'Producer',
			// 		Name: producerName,
			// 		Address: producerAddress,
			// 		LotNumber: lotNumber,
			// 		CrushDate: crushDate,
			// 		CrushTime: crushTime,
			// 		GrapeVariety: grapeVariety,
			// 	};

			// 	await transaction.submit(assetKey, 'blue', '10', 'Sam', JSON.stringify(producerTransaction));
			// 	console.log(`${GREEN}<-- Submit UpdateAsset Result: committed, asset ${assetKey}${RESET}`);
			// } catch (updateError) {
			// 	console.log(`${RED}<-- Failed: UpdateAsset - ${updateError}${RESET}`);
			// }
			// try {
			// 	// R E A D
			// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} should now have appraised value of 200${RESET}`);
			// 	const resultBuffer = await contract1Org1.evaluateTransaction('ReadAsset', assetKey);
			// 	checkAsset(org1, resultBuffer, 'blue', '10', 'Sam', JSON.stringify(producerTransaction));
			// } catch (readError) {
			// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
			// }

			// try {
			// 	// T R A N S F E R
			// 	console.log(`${GREEN}--> Submit Transaction: TransferAsset ${assetKey} to Mary`);
			// 	transaction = contract1Org1.createTransaction('TransferAsset');
			// 	await transaction.submit(assetKey, 'Mary');
			// 	console.log(`${GREEN}<-- Submit TransferAsset Result: committed, asset ${assetKey}${RESET}`);
			// } catch (transferError) {
			// 	console.log(`${RED}<-- Failed: TransferAsset - ${transferError}${RESET}`);
			// }
			// try {
			// 	// R E A D
			// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} should now be owned by Mary${RESET}`);
			// 	const resultBuffer = await contract1Org1.evaluateTransaction('ReadAsset', assetKey);
			// 	checkAsset(org1, resultBuffer, 'blue', '10', 'Mary', '200');
			// } catch (readError) {
			// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
			// }

			// try {
			// 	// D E L E T E
			// 	console.log(`${GREEN}--> Submit Transaction: DeleteAsset ${assetKey}`);
			// 	transaction = contract1Org1.createTransaction('DeleteAsset');
			// 	await transaction.submit(assetKey);
			// 	console.log(`${GREEN}<-- Submit DeleteAsset Result: committed, asset ${assetKey}${RESET}`);
			// } catch (deleteError) {
			// 	console.log(`${RED}<-- Failed: DeleteAsset - ${deleteError}${RESET}`);
			// 	if (deleteError.toString().includes('ENDORSEMENT_POLICY_FAILURE')) {
			// 		console.log(`${RED}Be sure that chaincode was deployed with the endorsement policy "OR('Org1MSP.peer','Org2MSP.peer')"${RESET}`);
			// 	}
			// }
			// try {
			// 	// R E A D
			// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} should now be deleted${RESET}`);
			// 	const resultBuffer = await contract1Org1.evaluateTransaction('ReadAsset', assetKey);
			// 	checkAsset(org1, resultBuffer, 'blue', '10', 'Mary', '200');
			// 	console.log(`${RED}<-- Failed: ReadAsset - should not have read this asset${RESET}`);
			// } catch (readError) {
			// 	console.log(`${GREEN}<-- Success: ReadAsset - ${readError}${RESET}`);
			// }

			// all done with this listener
			contract1Org1.removeContractListener(listener);

			//
			//  - - - - - -  B L O C K  E V E N T S  with  P R I V A T E  D A T A
			//
			// console.log(`${BLUE} **** BLOCK EVENTS with PRIVATE DATA ****${RESET}`);
			const network2Org1 = await gateway2Org1.getNetwork(channelName);
			const contract2Org1 = network2Org1.getContract(chaincodeName);

			let randomNumber;
			let assetKey;

			let firstBlock = true; // simple indicator to track blocks

			try {
				let listener;

				// create a block listener
				listener = async (event) => {
					// if (firstBlock) {
					// 	console.log(`${GREEN}<-- Block Event Received - block number: ${event.blockNumber.toString()}` +
					// 		'\n### Note:' +
					// 		'\n    This block event represents the current top block of the ledger.' +
					// 		`\n    All block events after this one are events that represent new blocks added to the ledger${RESET}`);
					// 	firstBlock = false;
					// } else {
					// 	console.log(`${GREEN}<-- Block Event Received - block number: ${event.blockNumber.toString()}${RESET}`);
					// }
					
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
				// now start the client side event service and register the listener
				// console.log(`${GREEN}--> Start private data block event stream to peer in Org1${RESET}`);
				await network2Org1.addBlockListener(listener, {type: 'private'});
			} catch (eventError) {
				console.log(`${RED}<-- Failed: Setup block events - ${eventError}${RESET}`);
			}

			primeira_exe = true;

			while(true){	
				randomNumber = Math.floor(Math.random() * 1000) + 1;
				assetKey = `item-${randomNumber}`;

				console.log(`${BLUE}Bem-vindo a WineChain${RESET}\n`);
				console.log(`${YELLOW}Escolha uma opção:${RESET}`);
				console.log(`${CYAN}1. Viticultor`);
				console.log(`2. Produtor de Vinho`);
				console.log(`3. Distribuidor a Granel`);
				console.log(`4. Enchedor/Embalador`);
				console.log(`5. Varejista`);
				console.log(`6. Histórico de Transações`);
				console.log(`7. Sair${RESET}`);

				const option = prompt('Escolha uma opção: ');
				
				switch (option) {
					case '1':
						//  contrato, chave, endosso, emissor, dados, entidade
						await createTransaction(contract2Org1, assetKey, org4, org1, dados_viticultor(), 'Viticultor');
						console.log(`${BLUE}Operação concluída com sucesso.${RESET}`);
						break;
					case '2':
						await createTransaction(contract2Org1, assetKey, org3, org1, dados_produtor_de_vinho(), 'Produtor de Vinho');
						console.log(`${BLUE}Operação concluída com sucesso.${RESET}`);
						break;
					case '3':
						await createTransaction(contract2Org1, assetKey, org3, org1, dados_distribuidor_agranel(), 'Distribuidor a Granel');
						console.log(`${BLUE}Operação concluída com sucesso.${RESET}`);
						break;
					case '4':
						await createTransaction(contract2Org1, assetKey, org2, org1, dados_enchedor_embalador(), 'Enchedor Embalador');
						console.log(`${BLUE}Operação concluída com sucesso.${RESET}`);
						break;
					case '5':
						await createTransaction(contract2Org1, assetKey, org2, org1, dados_varejista(), 'Varejista');
						console.log(`${BLUE}Operação concluída com sucesso.${RESET}`);
						break;
					case '6':
						// Lógica para exibir o histórico de transações
						readAssetKeys(contract2Org1, org1);

						break;
					case '7':
						console.log('Saindo...');
						process.exit(0);
						break;
					default:
						console.log('Opção inválida. Por favor, escolha uma opção válida.');
				}
				
				// all done with this listener
				network2Org1.removeBlockListener(listener);

				const continuar = prompt(`${YELLOW}Deseja realizar outra operação? (S para Sim, qualquer outra tecla para Sair): ${RESET}`);

				if (continuar.toUpperCase() !== 'S') {
				console.log('Saindo...');
				break;
				}
			}

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
	process.exit(0);
}
main();
