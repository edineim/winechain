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

// const assetKeysFilePath = path.join(__dirname, 'assetKeys.json');
// const assetKeys = loadAssetKeys();

// function loadAssetKeys() {
// 	try {
// 	  if (!fs.existsSync(assetKeysFilePath)) {
// 		saveAssetKeys([]); // Cria o arquivo se não existir
// 		return [];
// 	  }
  
// 	  const data = fs.readFileSync(assetKeysFilePath, 'utf8');
// 	  return JSON.parse(data);
// 	} catch (error) {
// 	  console.error(`Erro ao carregar as chaves de ativos: ${error}`);
// 	  return [];
// 	}
//   }

// function saveAssetKeys(keys) {
// 	const data = JSON.stringify(keys);
// 	fs.writeFileSync(assetKeysFilePath, data, 'utf8'); 

// } 

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

function imprimeAsset(resultBuffer) {

	let asset;
	if (resultBuffer) {
		asset = JSON.parse(resultBuffer.toString('utf8'));
	} else {
		console.log(`${RED}*** Failed to read asset${RESET}`);
	}
	console.log(`*** verify asset ${asset.ID}`);

	if (asset) {
		
		console.log(`*** asset ${asset.ID} owned by ${asset.Owner}`);

		console.log(`*** asset ${asset.ID} has produtor`);

		// Converter a string JSON para um objeto JavaScript
		var wineData = JSON.parse(asset.Produtor);

		// Loop através das propriedades do objeto e exibir de forma dinâmica
		for (var prop in wineData) {
			
		if (wineData.hasOwnProperty(prop)) {
			console.log("	 - " + prop + ": " + wineData[prop]);
		}
		}

        // if (typeof asset.Produtor === 'string') {
		// 	try {
		// 	  var wineData = JSON.parse(asset.Produtor);
  
		// 	  // Verificar se `wineData` é um objeto antes de iterar sobre suas propriedades.
		// 	  if (typeof wineData === 'object' && wineData !== null) {
		// 		// Loop através das propriedades do objeto e exibir de forma dinâmica
		// 		for (var prop in wineData) {
		// 		  if (wineData.hasOwnProperty(prop)) {
		// 			console.log(`  - ${prop}: ${wineData[prop]}`);
		// 		  }
		// 		}
		// 	  } else {
		// 		console.log('*** asset.Produtor is not a valid object.');
		// 	  }
		// 	} catch (error) {
		// 	  console.error('*** Error parsing asset.Produtor:', error);
		// 	}
		//   } else {
		// 	console.log('*** asset.Produtor is not a valid JSON string.');
		//   }
	

		console.log(`*** asset ${asset.ID} has distribuidor`);

		// Converter a string JSON para um objeto JavaScript
		var wineData = JSON.parse(asset.Distribuidor);

		// Loop através das propriedades do objeto e exibir de forma dinâmica
		for (var prop in wineData) {
			
		if (wineData.hasOwnProperty(prop)) {
			console.log("	 - " + prop + ": " + wineData[prop]);
		}
		}

		console.log(`*** asset ${asset.ID} has atacadista`);

		// Converter a string JSON para um objeto JavaScript
		var wineData = JSON.parse(asset.Atacadista);

		// Loop através das propriedades do objeto e exibir de forma dinâmica
		for (var prop in wineData) {
			
		if (wineData.hasOwnProperty(prop)) {
			console.log("	 - " + prop + ": " + wineData[prop]);
		}
		}

		console.log(`*** asset ${asset.ID} has varejista`);

		// Converter a string JSON para um objeto JavaScript
		var wineData = JSON.parse(asset.Varejista);

		// Loop através das propriedades do objeto e exibir de forma dinâmica
		for (var prop in wineData) {
			
		if (wineData.hasOwnProperty(prop)) {
			console.log("	 - " + prop + ": " + wineData[prop]);
		}
		}
	}
}

function checkAsset(org, resultBuffer, distribuidor, atacadista, varejista, owner, produtor) {
	console.log(`${GREEN}<-- Query results from ${org}${RESET}`);

	let asset;
	if (resultBuffer) {
		asset = JSON.parse(resultBuffer.toString('utf8'));
	} else {
		console.log(`${RED}*** Failed to read asset${RESET}`);
	}
	console.log(`*** verify asset ${asset.ID}`);

	if (asset) {
		
		if (asset.Owner === owner) {
			console.log(`*** asset ${asset.ID} owned by ${asset.Owner}`);
		} else {
			console.log(`${RED}*** Failed owner check from ${org} - asset ${asset.ID} owned by ${asset.Owner}${RESET}`);
		}

		if (asset.Produtor === produtor) {
			console.log(`*** asset ${asset.ID} has appraised value:`);

			// Converter a string JSON para um objeto JavaScript
			var wineData = JSON.parse(asset.Produtor);

			// Loop através das propriedades do objeto e exibir de forma dinâmica
			for (var prop in wineData) {
				
			if (wineData.hasOwnProperty(prop)) {
				console.log("	 - " + prop + ": " + wineData[prop]);
			}
			}

		} else {
			console.log(`${RED}*** Failed appraised value check from ${org} - asset ${asset.ID} has appraised value of ${asset.Produtor}${RESET}`);
		}

		if (asset.Distribuidor === distribuidor) {
			console.log(`*** asset ${asset.ID} has distribuidor ${asset.Distribuidor}`);
		} else {
			console.log(`${RED}*** asset ${asset.ID} has distribuidor of ${asset.Distribuidor}${RESET}`);
		}

		if (asset.Atacadista === atacadista) {
			console.log(`*** asset ${asset.ID} has atacadista ${asset.Atacadista}`);
		} else {
			console.log(`${RED}*** Failed atacadista check from ${org} - asset ${asset.ID} has atacadista of ${asset.Atacadista}${RESET}`);
		}

		if (asset.Varejista === varejista) {
			console.log(`*** asset ${asset.ID} has varejista ${asset.Varejista}`);
		} else {
			console.log(`${RED}*** Failed varejista check from ${org} - asset ${asset.ID} has varejista of ${asset.Varejista}${RESET}`);
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

function imprimirPropriedades(obj, prefixo = '') {
	for (const propriedade in obj) {
	  if (obj.hasOwnProperty(propriedade)) {
		const valor = obj[propriedade];
  
		// Verificar se o valor é um objeto ou array para chamada recursiva
		if (typeof valor === 'object' && valor !== null) {
		  imprimirPropriedades(valor, `${prefixo}${propriedade}.`);
		} else {
		  console.log(`${prefixo}${propriedade}: ${valor}`);
		}
	  }
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
				// if (prop === 'Viticultor'){
				// 	let aux = JSON.stringify(wineData)
				// 	console.log(aux)
				// }
			if (wineData.hasOwnProperty(prop)) {
				console.log("	 - " + prop + ": " + wineData[prop]);
			}
			}
		}
		else{
			console.log(`    - arg:${chaincode.input.args[x].toString()}`);
		}
		
	}
}

let producerTransaction;
let distributorTransaction;
let atacadistaTransaction;
let retailerTransaction;

function dados_produtor_de_vinho(NomeViticultor, EnderecoViticultor, VariedadeUva, DataColheita, NomeProdutorVinho, EnderecoProdutorVinho, Lote, IDRemessa, DataEmbarque, HoraEmbarque) {
    // Inicialize producerTransaction se ainda não estiver definido
    if (!producerTransaction) {
        producerTransaction = {};
    }

    // Se 'Viticultor' não existir, crie um array vazio
    if (!producerTransaction.Viticultor) {
        producerTransaction.Viticultor = [];
    }

    // Adicione um novo objeto de viticultor ao array
    const novoViticultor = {
        NomeViticultor: NomeViticultor,
        Endereco: EnderecoViticultor,
        VariedadeUva: VariedadeUva,
        DataColheita: DataColheita,
    };

    // Adicione o novo viticultor ao array 'Viticultor'
    producerTransaction.Viticultor.push(novoViticultor);

    // Adicione os outros campos à transação
    producerTransaction.NomeProdutorVinho = NomeProdutorVinho;
    producerTransaction.Endereco = EnderecoProdutorVinho;
    producerTransaction.Lote = Lote;
    producerTransaction.IDRemessa = IDRemessa;
    producerTransaction.DataEmbarque = DataEmbarque;
    producerTransaction.HoraEmbarque = HoraEmbarque;

    // console.log('Produtor de Vinho Transaction:', producerTransaction);
    main(producerTransaction, 'Produtor', 1);  // Chame a função 'main' com a entidade 'Producer'
}


  // Função para processar dados do distribuidor a granel
  function dados_distribuidor(NomeDistribuidor, Endereco, Lote, IDRemessa, DataEmbarque, HoraEmbarque) {
	distributorTransaction = {
	  Entidade: 'Distributor',
	  NomeProdutorDistribuidor: NomeDistribuidor,
	  EnderecoProdutorDistribuidor: Endereco,
	  Lote: Lote,
	  IDRemessa: IDRemessa,
	  DataEmbarque: DataEmbarque,
	  HoraEmbarque: HoraEmbarque,
	};
	console.log('Distribuidor Transaction:', distributorTransaction);
	main(distributorTransaction, distributorTransaction.Entidade, 2);
  }

// Função para processar dados do atacadista
function dados_atacadista(NomeAtacadista, EnderecoAtacadista, IDRemessaAtacadista, DataRecebimentoAtacadista, HoraRecebimentoAtacadista, QuantidadeRecebidaAtacadista) {
	atacadistaTransaction = {
	  Entidade: 'Atacadista',
	  NomeAtacadista: NomeAtacadista,
	  EnderecoAtacadista: EnderecoAtacadista,
	  IDRemessaAtacadista: IDRemessaAtacadista,
	  DataRecebimentoAtacadista: DataRecebimentoAtacadista,
	  HoraRecebimentoAtacadista: HoraRecebimentoAtacadista,
	  QuantidadeRecebidaAtacadista: QuantidadeRecebidaAtacadista,
	};
	console.log('Atacadista Transaction:', atacadistaTransaction);
	main(atacadistaTransaction, atacadistaTransaction.Entidade, 3); 
  }   
  
  // Função para processar dados do varejista
function dados_varejista(NomeVarejista, Endereco, Lote, DataVenda, IDRemessa, DataEmbarque, HoraEmbarque) {
	retailerTransaction = {
	  Entidade: 'Varejista',
	  NomeVarejista: NomeVarejista,
	  Endereco: Endereco,
	  Lote: Lote, 
	  DataVenda: DataVenda,
	  IDRemessa: IDRemessa,
	  DataEmbarque: DataEmbarque,
	  HoraEmbarque: HoraEmbarque,
	};
	console.log('Varejista Transaction:', retailerTransaction);
	main(retailerTransaction, retailerTransaction.Entidade, 4);
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

        await transaction.submit(assetKey, 'null', 'null', 'null', nome_da_entidade, JSON.stringify(dados));
        console.log(`${GREEN}<-- Submit CreateAsset Result: committed, asset ${assetKey}${RESET}`);
        await sleep(5000);
    } catch (error) {
        console.log(`${RED}<-- Failed: CreateAsset - ${error}${RESET}`);
    }
	// try {
	// 	// R E A D
	// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} ${RESET}`);
	// 	const resultBuffer = await contract.evaluateTransaction('ReadAsset', assetKey);
	// 	imprimeAsset(resultBuffer);
	// } catch (readError) {
	// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
	// }
}

async function queryAssetByKey(contract, assetKey) {
    try {
        const assetBuffer = await contract.evaluateTransaction('queryAssetByKey', assetKey);
        // Verificar se o ativo foi encontrado
        if (!assetBuffer || assetBuffer.length === 0) {
            console.log(`${RED}<-- Asset not found for Key: ${assetKey}${RESET}`);
            return;
        }
        // Converter o buffer do ativo para uma string JSON
        const assetString = assetBuffer.toString('utf8');

        // Imprimir detalhes do ativo
        console.log(`${GREEN}Asset Details for Key ${assetKey}:${RESET}`);		
        // console.log(JSON.parse(assetString));

		let meuObjeto;

		meuObjeto = JSON.parse(assetString);

		for (const propriedade in meuObjeto) {
			if (meuObjeto.hasOwnProperty(propriedade)) {
			  const valor = meuObjeto[propriedade];
		  
			  // Tenta fazer o parsing da string JSON
			  let objetoJSON;
			  try {
				objetoJSON = JSON.parse(valor);
			  } catch (error) {
				objetoJSON = null;
			  }
		  
			  // Imprime o nome da propriedade e seu valor	
			//   console.log(typeof objetoJSON)

			  if (objetoJSON  && (typeof valor !== 'number')) {				
				console.log(`Propriedade: ${propriedade}`);
				console.log('Valor (objeto JSON):', objetoJSON);
			  } 
			}			
		}

		return meuObjeto;

	} catch (queryError) {
		console.error(`${RED}<-- Failed to query asset - ${queryError}${RESET}`);
	}
}

async function transferTransactionDistribuidor(contract, assetKey, endorsingOrg, nome_da_entidade, dados_adicionais){
	let transaction;
	try {
		// T R A N S F E R
		console.log(`${GREEN}--> Submit Transaction: TransferAssetDistribuidor ${assetKey} to ${nome_da_entidade}`);
		transaction = contract.createTransaction('TransferAssetDistribuidor');

		// update the private data with new salt and assign to the transaction
		const randomNumber = Math.floor(Math.random() * 100) + 1;
		const asset_properties = {
			object_type: 'asset_properties',
			asset_id: assetKey,
			salt: Buffer.from(randomNumber.toString()).toString('hex'),
		};

		const asset_properties_string = JSON.stringify(asset_properties);
		transaction.setTransient({
			asset_properties: Buffer.from(asset_properties_string)
		});
		transaction.setEndorsingOrganizations(endorsingOrg);

		await transaction.submit(assetKey, `${nome_da_entidade}`, `${JSON.stringify(dados_adicionais)}`);
		console.log(`${GREEN}<-- Submit TransferAssetDistribuidor Result: committed, asset ${assetKey}${RESET}`);
	} catch (transferError) {
		console.log(`${RED}<-- Failed: TransferAssetDistribuidor - ${transferError}${RESET}`);
	}
	await sleep(5000); // need to wait for event to be committed
	// try {
	// 	// R E A D
	// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} ${RESET}`);
	// 	const resultBuffer = await contract.evaluateTransaction('ReadAsset', assetKey);
	// 	imprimeAsset(resultBuffer);
	// } catch (readError) {
	// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
	// }
}

async function transferTransactionAtacadista(contract, assetKey, endorsingOrg, nome_da_entidade, dados_adicionais){
	let transaction;
	try {
		// T R A N S F E R
		console.log(`${GREEN}--> Submit Transaction: TransferAssetAtacadista ${assetKey} to ${nome_da_entidade}`);
		transaction = contract.createTransaction('TransferAssetAtacadista');

		// update the private data with new salt and assign to the transaction
		const randomNumber = Math.floor(Math.random() * 100) + 1;
		const asset_properties = {
			object_type: 'asset_properties',
			asset_id: assetKey,
			salt: Buffer.from(randomNumber.toString()).toString('hex'),
		};

		const asset_properties_string = JSON.stringify(asset_properties);
		transaction.setTransient({
			asset_properties: Buffer.from(asset_properties_string)
		});
		transaction.setEndorsingOrganizations(endorsingOrg);

		await transaction.submit(assetKey, `${nome_da_entidade}`, `${JSON.stringify(dados_adicionais)}`);
		console.log(`${GREEN}<-- Submit TransferAssetAtacadista Result: committed, asset ${assetKey}${RESET}`);
	} catch (transferError) {
		console.log(`${RED}<-- Failed: TransferAssetAtacadista - ${transferError}${RESET}`);
	}
	await sleep(5000); // need to wait for event to be committed
	// try {
	// 	// R E A D
	// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} ${RESET}`);
	// 	const resultBuffer = await contract.evaluateTransaction('ReadAsset', assetKey);
	// 	imprimeAsset(resultBuffer);
	// } catch (readError) {
	// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
	// }
}

async function transferTransactionVarejista(contract, assetKey, endorsingOrg, nome_da_entidade, dados_adicionais){
	let transaction;
	try {
		// T R A N S F E R
		console.log(`${GREEN}--> Submit Transaction: TransferAssetVarejista ${assetKey} to ${nome_da_entidade}`);
		transaction = contract.createTransaction('TransferAssetVarejista');

		// update the private data with new salt and assign to the transaction
		const randomNumber = Math.floor(Math.random() * 100) + 1;
		const asset_properties = {
			object_type: 'asset_properties',
			asset_id: assetKey,
			salt: Buffer.from(randomNumber.toString()).toString('hex'),
		};

		const asset_properties_string = JSON.stringify(asset_properties);
		transaction.setTransient({
			asset_properties: Buffer.from(asset_properties_string)
		});
		transaction.setEndorsingOrganizations(endorsingOrg);

		await transaction.submit(assetKey, `${nome_da_entidade}`, `${JSON.stringify(dados_adicionais)}`);
		console.log(`${GREEN}<-- Submit TransferAssetVarejista Result: committed, asset ${assetKey}${RESET}`);
	} catch (transferError) {
		console.log(`${RED}<-- Failed: TransferAssetVarejista - ${transferError}${RESET}`);
	}
	await sleep(5000); // need to wait for event to be committed
	// try {
	// 	// R E A D
	// 	console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey} ${RESET}`);
	// 	const resultBuffer = await contract.evaluateTransaction('ReadAsset', assetKey);
	// 	imprimeAsset(resultBuffer);
	// } catch (readError) {
	// 	console.log(`${RED}<-- Failed: ReadAsset - ${readError}${RESET}`);
	// }
}

async function readAsset(contract, assetKey, org1, dados, nome_da_entidade) {
    try {
        console.log(`${GREEN}--> Evaluate: ReadAsset, - ${assetKey}, Le ${nome_da_entidade} ${RESET}`);
        const resultBuffer = await contract.evaluateTransaction('ReadAsset', assetKey);

        // Certifique-se de que resultBuffer é uma string antes de tentar analisá-la como JSON
        const resultString = resultBuffer.toString('utf8');

        try {
            // Tente analisar resultString como JSON
            const resultJSON = JSON.parse(resultString);

            // Se resultJSON é um objeto, pode ser usado diretamente
            // Chame a função checkAsset com resultJSON
            checkAsset(org1, resultJSON, 'null', 'null', 'null', 'null', JSON.stringify(dados));
        } catch (jsonError) {
            // Se houver um erro ao analisar, pode ser que o resultado já seja um objeto JavaScript
            // Trate o resultado como um objeto
            checkAsset(org1, resultBuffer, 'null', 'null', 'null', 'null', JSON.stringify(dados));
        }
    } catch (error) {
        console.log(`${RED}<-- Failed: ReadAsset - ${error}${RESET}`);
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
			checkAsset(org1, resultBuffer, 'null', 'null', 'null', 'null', JSON.stringify(entity));
		
		}
	}
}


async function main(dataTransaction, nome_da_entidade, numero_da_entidade) {
	console.log(`${BLUE} **** START ****${RESET}`);
	try {
		// const gateway1Org1 = await initGatewayForOrg1(true); 

		let transaction;
		let listener;

		// const network1Org1 = await gateway1Org1.getNetwork(channelName);
		// const contract1Org1 = network1Org1.getContract(chaincodeName);

		// contract1Org1.removeContractListener(listener);
		let gateway;

		if (numero_da_entidade === 1){
			gateway = await initGatewayForOrg1(true);
		} else if (numero_da_entidade === 2){
			gateway = await initGatewayForOrg2(true);
		} else if (numero_da_entidade === 3){
			gateway = await initGatewayForOrg3(true);
		} else if (numero_da_entidade === 4){
			gateway = await initGatewayForOrg4(true);
		} else if (numero_da_entidade === 5){
			gateway = await initGatewayForOrg1(true);
		}

		const network = await gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);


		let randomNumber;
		let assetKey;

		let firstBlock = true; // simple indicator to track blocks

		try {
			let listener;

			// create a block listener
			listener = async (event) => {
				const transEvents = event.getTransactionEvents();
				if (primeira_exe){
					if (numero_da_entidade !== 5) {console.log(`${GREEN}<-- Block Event Received - block number: ${event.blockNumber.toString()}${RESET}`);}
					for (const transEvent of transEvents) {
						if (numero_da_entidade !== 5) {console.log(`*** transaction event: ${transEvent.transactionId}`);}
						if (transEvent.privateData) {
							for (const namespace of transEvent.privateData.ns_pvt_rwset) {
								if (numero_da_entidade !== 5) {console.log(`    - private data: ${namespace.namespace}`);}
								for (const collection of namespace.collection_pvt_rwset) {
									if (numero_da_entidade !== 5) {console.log(`     - collection: ${collection.collection_name}`);}
									if (collection.rwset.reads) {
										for (const read of collection.rwset.reads) {
											if (numero_da_entidade !== 5) {console.log(`       - read set - ${BLUE}key:${RESET} ${read.key}  ${BLUE}value:${read.value.toString()}`);}
										}
									}
									if (collection.rwset.writes) {
										for (const write of collection.rwset.writes) {
											if (numero_da_entidade !== 5) {console.log(`      - write set - ${BLUE}key:${RESET}${write.key} ${BLUE}is_delete:${RESET}${write.is_delete} ${BLUE}value:${RESET}${write.value.toString()}`);}
										}
									}
								}
							}
						}
						if (transEvent.transactionData) {
							if (numero_da_entidade !== 5) {showTransactionData(transEvent.transactionData);}
						}
					}
				}
			};

			await network.addBlockListener(listener, {type: 'private'});

			primeira_exe = true;	
			// randomNumber = Math.floor(Math.random() * 1000) + 1;
			// assetKey = `item-${randomNumber}`;
			assetKey = 'item-001';

			if (numero_da_entidade === 1){
				
				await createTransaction(contract, assetKey, org1, org1, dataTransaction, nome_da_entidade);
				// await queryAssetByKey(contract, assetKey);

			} else if (numero_da_entidade === 2){

				// console.log(`----------------------------------ANTES----${nome_da_entidade}-------------------------------------------`);
				// await queryAssetByKey(contract, assetKey);
				// await imprimeAsset(contract, assetKey);
				// console.log('---------------------------------------------------------------------------------------------------------');
				await transferTransactionDistribuidor(contract, assetKey, org2, nome_da_entidade, dataTransaction);
				// console.log(`----------------------------------DEPOIS----${nome_da_entidade}------------------------------------------`);
				// await queryAssetByKey(contract, assetKey);
				// await imprimeAsset(contract, assetKey);

			} else if (numero_da_entidade === 3){

				// console.log(`----------------------------------ANTES----${nome_da_entidade}-------------------------------------------`);
				// await queryAssetByKey(contract, assetKey);
				// await imprimeAsset(contract, assetKey);
				// console.log('---------------------------------------------------------------------------------------------------------');
				await transferTransactionAtacadista(contract, assetKey, org3, nome_da_entidade, dataTransaction);
				// console.log(`----------------------------------DEPOIS----${nome_da_entidade}------------------------------------------`);
				// await queryAssetByKey(contract, assetKey);
				// await imprimeAsset(contract, assetKey);

			} else if (numero_da_entidade === 4){

				// console.log(`----------------------------------ANTES----${nome_da_entidade}-------------------------------------------`);
				// await queryAssetByKey(contract, assetKey);
				// await imprimeAsset(contract, assetKey);
				// console.log('---------------------------------------------------------------------------------------------------------');
				await transferTransactionVarejista(contract, assetKey, org4, nome_da_entidade, dataTransaction);
				// console.log(`----------------------------------DEPOIS----${nome_da_entidade}------------------------------------------`);
				// await queryAssetByKey(contract, assetKey);
				// await imprimeAsset(contract, assetKey);

			}		
			
			else if (numero_da_entidade === 5){
				let resultado; 
				resultado = await queryAssetByKey(contract, dataTransaction);
				return resultado;
			}			

			network.removeBlockListener(listener);			

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
	main,
	dados_produtor_de_vinho,
	dados_distribuidor,
	dados_atacadista,
	dados_varejista,
	getProducerTransaction: () => producerTransaction,
	getDistributorTransaction: () => distributorTransaction,
	getAtacadistaTransaction: () => atacadistaTransaction,
	getRetailerTransaction: () => retailerTransaction,
  };