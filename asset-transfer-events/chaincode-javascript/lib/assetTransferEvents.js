/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

async function savePrivateData(ctx, assetKey) {
	const clientOrg = ctx.clientIdentity.getMSPID();
	const peerOrg = ctx.stub.getMspID();
	const collection = '_implicit_org_' + peerOrg;

	if (clientOrg === peerOrg) {
		const transientMap = ctx.stub.getTransient();
		if (transientMap) {
			const properties = transientMap.get('asset_properties');
			if (properties) {
				await ctx.stub.putPrivateData(collection, assetKey, properties);
			}
		}
	}
}

async function removePrivateData(ctx, assetKey) {
	const clientOrg = ctx.clientIdentity.getMSPID();
	const peerOrg = ctx.stub.getMspID();
	const collection = '_implicit_org_' + peerOrg;

	if (clientOrg === peerOrg) {
		const propertiesBuffer = await ctx.stub.getPrivateData(collection, assetKey);
		if (propertiesBuffer && propertiesBuffer.length > 0) {
			await ctx.stub.deletePrivateData(collection, assetKey);
		}
	}
}

async function addPrivateData(ctx, assetKey, asset) {
	const clientOrg = ctx.clientIdentity.getMSPID();
	const peerOrg = ctx.stub.getMspID();
	const collection = '_implicit_org_' + peerOrg;

	if (clientOrg === peerOrg) {
		const propertiesBuffer = await ctx.stub.getPrivateData(collection, assetKey);
		if (propertiesBuffer && propertiesBuffer.length > 0) {
			const properties = JSON.parse(propertiesBuffer.toString());
			asset.asset_properties = properties;
		}
	}
}

async function readState(ctx, id) {
	const assetBuffer = await ctx.stub.getState(id); // get the asset from chaincode state
	if (!assetBuffer || assetBuffer.length === 0) {
		throw new Error(`The asset ${id} does not exist`);
	}
	const assetString = assetBuffer.toString();
	const asset = JSON.parse(assetString);

	return asset;
}

class AssetTransferEvents extends Contract {

	// CreateAsset issues a new asset to the world state with given details.
	// async CreateAsset(ctx, id, distribuidor, varejista, owner, produtor) {
	// 	const asset = {
	// 		ID: id,
	// 		Distribuidor: distribuidor,
	// 		Varejista: varejista,
	// 		Owner: owner,
	// 		Produtor: produtor,
	// 	};
	// 	await savePrivateData(ctx, id);
	// 	const assetBuffer = Buffer.from(JSON.stringify(asset));

	// 	ctx.stub.setEvent('CreateAsset', assetBuffer);
	// 	return ctx.stub.putState(id, assetBuffer);
	// }

	// CreateAsset
	// Mudando a ordem da struct
	async CreateAsset(ctx, id, distribuidor, atacadista, varejista, owner, produtor) {
		const asset = {
			ID: id,
			Owner: owner,
			Produtor: produtor,
			Distribuidor: distribuidor,
			Atacadista: atacadista,
			Varejista: varejista			
		};
		await savePrivateData(ctx, id);
		const assetBuffer = Buffer.from(JSON.stringify(asset));

		ctx.stub.setEvent('CreateAsset', assetBuffer);
		return ctx.stub.putState(id, assetBuffer);
	}

	// TransferAsset updates the owner field of an asset with the given id in
	// the world state.
	async TransferAssetDistribuidor(ctx, id, newOwner, distribuidor) {
		const asset = await readState(ctx, id);
		asset.Owner = newOwner;
		asset.Distribuidor = distribuidor;
		const assetBuffer = Buffer.from(JSON.stringify(asset));
		await savePrivateData(ctx, id);

		ctx.stub.setEvent('TransferAssetDistribuidor', assetBuffer);
		return ctx.stub.putState(id, assetBuffer);
	}

	async TransferAssetAtacadista(ctx, id, newOwner, atacadista) {
		const asset = await readState(ctx, id);
		asset.Owner = newOwner;
		asset.Atacadista = atacadista;
		const assetBuffer = Buffer.from(JSON.stringify(asset));
		await savePrivateData(ctx, id);

		ctx.stub.setEvent('TransferAssetAtacadista', assetBuffer);
		return ctx.stub.putState(id, assetBuffer);
	}

	async TransferAssetVarejista(ctx, id, newOwner, varejista) {
		const asset = await readState(ctx, id);
		asset.Owner = newOwner;
		asset.Varejista = varejista;
		const assetBuffer = Buffer.from(JSON.stringify(asset));
		await savePrivateData(ctx, id);

		ctx.stub.setEvent('TransferAssetVarejista', assetBuffer);
		return ctx.stub.putState(id, assetBuffer);
	}

	// ReadAsset returns the asset stored in the world state with given id.
	async ReadAsset(ctx, id) {
		const asset = await readState(ctx, id);
		await addPrivateData(ctx, asset.ID, asset);

		return JSON.stringify(asset);
	}

	// UpdateAsset updates an existing asset in the world state with provided parameters.
	async UpdateAsset(ctx, id, distribuidor, varejista, atacadista, owner, produtor) {
		const asset = await readState(ctx, id);
		asset.Distribuidor = distribuidor;
		asset.Varejista = varejista;
		asset.Atacadista = atacadista;
		asset.Owner = owner;
		asset.Produtor = produtor;
		const assetBuffer = Buffer.from(JSON.stringify(asset));
		await savePrivateData(ctx, id);

		ctx.stub.setEvent('UpdateAsset', assetBuffer);
		return ctx.stub.putState(id, assetBuffer);
	}

	// DeleteAsset deletes an given asset from the world state.
	async DeleteAsset(ctx, id) {
		const asset = await readState(ctx, id);
		const assetBuffer = Buffer.from(JSON.stringify(asset));
		await removePrivateData(ctx, id);

		ctx.stub.setEvent('DeleteAsset', assetBuffer);
		return ctx.stub.deleteState(id);
	}

	async queryAssetByKey(ctx, assetKey) {
        const assetBuffer = await ctx.stub.getState(assetKey);

        if (!assetBuffer || assetBuffer.length === 0) {
            return null; // Ativo não encontrado
        }

        const assetString = assetBuffer.toString('utf8');
        const asset = JSON.parse(assetString);

		if (asset.dados_adicionais) {
			return asset;
		}
		else{
			return asset;
		}	        
    }

	// async CreateGenesisBlock(ctx, viticultor, enderecoViticultor, variedadeUva, dataColheita) {
	// 	const genesisBlock = {
	// 		Viticultor: viticultor,
	// 		EnderecoViticultor: enderecoViticultor,
	// 		VariedadeUva: variedadeUva,
	// 		DataColheita: dataColheita,
	// 	};
	
	// 	const genesisBlockBuffer = Buffer.from(JSON.stringify(genesisBlock));
	
	// 	ctx.stub.setEvent('CreateGenesisBlock', genesisBlockBuffer);
	// 	return ctx.stub.putState('genesis', genesisBlockBuffer);
	// }

	// async TransferToDistributor(ctx, idRemessa, nomeProdutorDistribuidor, enderecoProdutorDistribuidor, lote, dataEmbarque, horaEmbarque) {
	// 	const block = await readState(ctx, 'genesis');
	
	// 	const transaction = {
	// 		IDRemessa: idRemessa,
	// 		NomeProdutorDistribuidor: nomeProdutorDistribuidor,
	// 		EnderecoProdutorDistribuidor: enderecoProdutorDistribuidor,
	// 		Lote: lote,
	// 		DataEmbarque: dataEmbarque,
	// 		HoraEmbarque: horaEmbarque,
	// 	};
	
	// 	block.Transactions.push(transaction);
	
	// 	const blockBuffer = Buffer.from(JSON.stringify(block));
	
	// 	ctx.stub.setEvent('TransferToDistributor', blockBuffer);
	// 	return ctx.stub.putState('genesis', blockBuffer);
	// }
	
	// async TransferToRetailer(ctx, idRemessa, nomeDistribuidor, endereco, dataEmbarque, horaEmbarque) {
	// 	const block = await readState(ctx, 'genesis');
	
	// 	const transaction = {
	// 		IDRemessa: idRemessa,
	// 		NomeDistribuidor: nomeDistribuidor,
	// 		Endereco: endereco,
	// 		DataEmbarque: dataEmbarque,
	// 		HoraEmbarque: horaEmbarque,
	// 	};
	
	// 	block.Transactions.push(transaction);
	
	// 	const blockBuffer = Buffer.from(JSON.stringify(block));
	
	// 	ctx.stub.setEvent('TransferToRetailer', blockBuffer);
	// 	return ctx.stub.putState('genesis', blockBuffer);
	// }
}

module.exports = AssetTransferEvents;


// 'use strict';

// const { Contract } = require('fabric-contract-api');

// async function savePrivateData(ctx, assetKey, previousBlockID) {
//     const clientOrg = ctx.clientIdentity.getMSPID();
//     const peerOrg = ctx.stub.getMspID();
//     const collection = '_implicit_org_' + peerOrg;

//     const data = {
//         previousBlockID: previousBlockID
//     };

//     if (clientOrg === peerOrg) {
//         const transientMap = ctx.stub.getTransient();
//         if (transientMap) {
//             const properties = transientMap.get('asset_properties');
//             if (properties) {
//                 data.asset_properties = properties;
//             }
//         }
//     }

//     await ctx.stub.putPrivateData(collection, assetKey, Buffer.from(JSON.stringify(data)));
// }

// async function removePrivateData(ctx, assetKey) {
//     const clientOrg = ctx.clientIdentity.getMSPID();
//     const peerOrg = ctx.stub.getMspID();
//     const collection = '_implicit_org_' + peerOrg;

//     if (clientOrg === peerOrg) {
//         const dataBuffer = await ctx.stub.getPrivateData(collection, assetKey);
//         if (dataBuffer && dataBuffer.length > 0) {
//             await ctx.stub.deletePrivateData(collection, assetKey);
//         }
//     }
// }

// async function addPrivateData(ctx, assetKey, asset) {
//     const clientOrg = ctx.clientIdentity.getMSPID();
//     const peerOrg = ctx.stub.getMspID();
//     const collection = '_implicit_org_' + peerOrg;

//     if (clientOrg === peerOrg) {
//         const dataBuffer = await ctx.stub.getPrivateData(collection, assetKey);
//         if (dataBuffer && dataBuffer.length > 0) {
//             const data = JSON.parse(dataBuffer.toString());
//             if (data.asset_properties) {
//                 asset.asset_properties = data.asset_properties;
//             }
//             asset.previousBlockID = data.previousBlockID;
//         }
//     }
// }

// async function readState(ctx, id) {
//     const assetBuffer = await ctx.stub.getState(id);
//     if (!assetBuffer || assetBuffer.length === 0) {
//         throw new Error(`The asset ${id} does not exist`);
//     }
//     const assetString = assetBuffer.toString();
//     const asset = JSON.parse(assetString);

//     return asset;
// }

// class AssetTransferEvents extends Contract {

//     async CreateAsset(ctx, id, distribuidor, varejista, owner, produtor, previousBlockID) {
//         const asset = {
//             ID: id,
//             Distribuidor: distribuidor,
//             Varejista: varejista,
//             Owner: owner,
//             Produtor: produtor,
//         };
//         await savePrivateData(ctx, id, previousBlockID);
//         const assetBuffer = Buffer.from(JSON.stringify(asset));

//         ctx.stub.setEvent('CreateAsset', assetBuffer);
//         return ctx.stub.putState(id, assetBuffer);
//     }

//     async TransferAsset(ctx, id, newOwner, previousBlockID) {
//         const asset = await readState(ctx, id);
//         asset.Owner = newOwner;
//         const assetBuffer = Buffer.from(JSON.stringify(asset));
//         await savePrivateData(ctx, id, previousBlockID);

//         ctx.stub.setEvent('TransferAsset', assetBuffer);
//         return ctx.stub.putState(id, assetBuffer);
//     }

//     async ReadAsset(ctx, id) {
//         const asset = await readState(ctx, id);
//         await addPrivateData(ctx, asset.ID, asset);

//         return JSON.stringify(asset);
//     }

//     async UpdateAsset(ctx, id, distribuidor, varejista, owner, produtor, previousBlockID) {
//         const asset = await readState(ctx, id);
//         asset.Distribuidor = distribuidor;
//         asset.Varejista = varejista;
//         asset.Owner = owner;
//         asset.Produtor = produtor;
//         const assetBuffer = Buffer.from(JSON.stringify(asset));
//         await savePrivateData(ctx, id, previousBlockID);

//         ctx.stub.setEvent('UpdateAsset', assetBuffer);
//         return ctx.stub.putState(id, assetBuffer);
//     }

//     async DeleteAsset(ctx, id, previousBlockID) {
//         const asset = await readState(ctx, id);
//         const assetBuffer = Buffer.from(JSON.stringify(asset));
//         await removePrivateData(ctx, id);
//         await savePrivateData(ctx, id, previousBlockID);

//         ctx.stub.setEvent('DeleteAsset', assetBuffer);
//         return ctx.stub.deleteState(id);
//     }
// }

// module.exports = AssetTransferEvents;