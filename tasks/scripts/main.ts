import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AutoBodyShop } from "../../src/types/contracts/AutoBodyShop";
import { KittyKartAsset } from "../../src/types/contracts/KittyKartAsset";
import { KittyKartGoKart } from "../../src/types/contracts/KittyKartGoKart";
import { KittyKartMarketplace } from "../../src/types/contracts/KittyKartMarketplace";
import { AutoBodyShop__factory } from "../../src/types/factories/contracts/AutoBodyShop__factory";
import { KittyKartAsset__factory } from "../../src/types/factories/contracts/KittyKartAsset__factory";
import { KittyKartGoKart__factory } from "../../src/types/factories/contracts/KittyKartGoKart__factory";
import { KittyKartMarketplace__factory } from "../../src/types/factories/contracts/KittyKartMarketplace__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

/**
 * @note AutoBodyShop contract will be deprecated once we build out backend service for it
 */

task("main:createTables").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const registryAddress = readValue("registry");

  // attach KittyKartGoKart
  const kittyKartGoKartFactory: KittyKartGoKart__factory = <KittyKartGoKart__factory>(
    await ethers.getContractFactory("KittyKartGoKart", accounts[0])
  );
  const kittyKartGoKart: KittyKartGoKart = await kittyKartGoKartFactory.attach(kittyKartGoKartProxyAddress);
  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    // create metadata table for KittyKartGoKart
    await kittyKartGoKart.createMetadataTable(registryAddress);
    console.log("KittyKartGoKart:createMetadataTable success");

    // create metadata table for KittyKartAsset
    await kittyKartAsset.createMetadataTable(registryAddress);
    console.log("KittyKartAsset:createMetadataTable success");

    console.log("main:createTable success");
  } catch (err) {
    console.log("main:createTable error", err);
  }
});

task("main:initContracts").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");
  const kittyKartMarketplaceProxyAddress = readContractAddress("kittyKartMarketplaceProxy");
  const gameServerAddress = readValue("gameServer");

  // attach KittyKartGoKart
  const kittyKartGoKartFactory: KittyKartGoKart__factory = <KittyKartGoKart__factory>(
    await ethers.getContractFactory("KittyKartGoKart", accounts[0])
  );
  const kittyKartGoKart: KittyKartGoKart = await kittyKartGoKartFactory.attach(kittyKartGoKartProxyAddress);
  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);
  // attach AutoBodyShop
  const autoBodyShopFactory: AutoBodyShop__factory = <AutoBodyShop__factory>(
    await ethers.getContractFactory("AutoBodyShop", accounts[0])
  );
  const autoBodyShop: AutoBodyShop = await autoBodyShopFactory.attach(autoBodyShopProxyAddress);
  // attach KittyKartMarketplace
  const kittyKartMarketplaceFactory: KittyKartMarketplace__factory = <KittyKartMarketplace__factory>(
    await ethers.getContractFactory("KittyKartMarketplace", accounts[0])
  );
  const kittyKartMarketplace: KittyKartMarketplace = await kittyKartMarketplaceFactory.attach(
    kittyKartMarketplaceProxyAddress,
  );

  try {
    // get metadata table id for KittyKartGoKart
    const kittyKartGoKartTableIdBN = await kittyKartGoKart.metadataTableId();
    const kittyKartGoKartTableId = +kittyKartGoKartTableIdBN.toString();
    writeValue("kittyKartGoKartTableId", kittyKartGoKartTableId);

    // get metadata table for KittyKartGoKart
    const kittyKartGoKartTable = await kittyKartGoKart.metadataTable();
    writeValue("kittyKartGoKartTable", kittyKartGoKartTable);
    console.log("KittyKartGoKart:getMetadataTable success", kittyKartGoKartTableId, kittyKartGoKartTable);

    // get metadata table id for KittyKartAsset
    const kittyKartAssetTableIdBN = await kittyKartAsset.metadataTableId();
    const kittyKartAssetTableId = +kittyKartAssetTableIdBN.toString();
    writeValue("kittyKartAssetTableId", kittyKartAssetTableId);

    // get metadata table for KittyKartAsset
    const kittyKartAssetTable = await kittyKartAsset.metadataTable();
    writeValue("kittyKartAssetTable", kittyKartAssetTable);

    // get attribute table for KittyKartAsset
    const kittyKartAssetAttributeTable = await kittyKartAsset.attributeTable();
    writeValue("kittyKartAssetAttributeTable", kittyKartAssetAttributeTable);
    console.log(
      "KittyKartAsset:getMetadataTable success",
      kittyKartAssetTableId,
      kittyKartAssetTable,
      kittyKartAssetAttributeTable,
    );

    // set gameServer in KittyKartAsset
    await kittyKartAsset.setGameServer(gameServerAddress);
    console.log("KittyKartAsset:setGameServer success", gameServerAddress);

    // set asset attribute table in KittyKartGoKart
    await kittyKartGoKart.setAssetAttributeTable(kittyKartAssetAttributeTable);
    console.log("KittyKartGoKart:setAssetAttributeTable success", kittyKartAssetAttributeTable);

    // set KittyKartGoKart in AutoBodyShop
    await autoBodyShop.setKittyKartGoKart(kittyKartGoKartProxyAddress);
    console.log("AutoBodyShop:setKittyKartGoKart success", kittyKartGoKartProxyAddress);

    // set KittyKartAsset in AutoBodyShop
    await autoBodyShop.setKittyKartAsset(kittyKartAssetProxyAddress);
    console.log("AutoBodyShop:setKittyKartAsset success", kittyKartAssetProxyAddress);

    // set kittyKartGoKartTableId in AutoBodyShop
    await autoBodyShop.setKittyKartGoKartTableId(kittyKartGoKartTableId);
    console.log("AutoBodyShop:kittyKartGoKartTableId success", kittyKartGoKartTableId);

    // get metadata table id for KittyKartAsset
    const kittyKartAssetAttributeTableIdBN = await kittyKartAsset.attributeTableId();
    const kittyKartAssetAttributeTableId = +kittyKartAssetAttributeTableIdBN.toString();
    writeValue("kittyKartAssetAttributeTableId", kittyKartAssetAttributeTableId);

    // set kittyKartAssetAttributeTableId in AutoBodyShop
    await autoBodyShop.setKittyKartAssetAttributeTableId(kittyKartAssetAttributeTableId);
    console.log("AutoBodyShop:setKittyKartAssetAttributeTableId success", kittyKartAssetAttributeTableId);

    // grant table access to AutoBodyShop
    await kittyKartGoKart.grantAccess(autoBodyShopProxyAddress);
    console.log("KittyKartGoKart:grantTableAccessToAutoBodyShop success", kittyKartAssetAttributeTableId);
    await kittyKartAsset.grantAccess(autoBodyShopProxyAddress);
    console.log("KittyKartAsset:grantTableAccessToAutoBodyShop success", kittyKartAssetAttributeTableId);

    // set AutoBodyShop to approvedMarketplace
    await kittyKartGoKart.setApprovedMarketplace(autoBodyShopProxyAddress, true);
    console.log("KittyKartGoKart:setAutoBodyShopToApprovedMarketplace success", autoBodyShopProxyAddress);
    await kittyKartAsset.setApprovedMarketplace(autoBodyShopProxyAddress, true);
    console.log("KittyKartAsset:setAutoBodyShopToApprovedMarketplace success", autoBodyShopProxyAddress);

    // set AutoBodyShop to KittyKartAsset
    await kittyKartAsset.setAutoBodyShop(autoBodyShopProxyAddress);
    console.log("KittyKartAsset:setAutoBodyShop success", autoBodyShopProxyAddress);

    // set gameServer in AutoBodyShop
    await autoBodyShop.setGameServer(gameServerAddress);
    console.log("AutoBodyShop:setGameServer success", gameServerAddress);

    /** init marketplace */
    // set gameServer in KittyKartMarketplace
    await kittyKartMarketplace.setGameServer(gameServerAddress);
    console.log("KittyKartMarketplace:setGameServer success");
    // set KittyKartGoKart address in KittyKartMarketplace
    await kittyKartMarketplace.setKittyKartGoKart(kittyKartGoKartProxyAddress);
    console.log("KittyKartMarketplace:setKittyKartGoKart success");
    // set KittyKartAsset address in KittyKartMarketplace
    await kittyKartMarketplace.setKittyKartAsset(kittyKartAssetProxyAddress);
    console.log("KittyKartMarketplace:setKittyKartAsset success");

    console.log("main:initContracts success");
  } catch (err) {
    console.log("main:initContracts error", err);
  }
});
