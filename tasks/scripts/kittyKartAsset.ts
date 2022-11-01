import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKartAsset } from "../../src/types/contracts/KittyKartAsset";
import { KittyKartAsset__factory } from "../../src/types/factories/contracts/KittyKartAsset__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

// set all variables needed for kittyKartAsset
task("KittyKartAsset:initialize").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const registryAddress = readValue("registry");
  const gameServerAddress = readValue("gameServer");

  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    await kittyKartAsset.createMetadataTable(registryAddress);
    await kittyKartAsset.setGameServer(gameServerAddress);
    console.log("KittyKartAsset:initialize success");
  } catch (err) {
    console.log("KittyKartAsset:initialize error", err);
  }
});

task("KittyKartAsset:createMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const registryAddress = readValue("registry");

  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    await kittyKartAsset.createMetadataTable(registryAddress);
    console.log("KittyKartAsset:createMetadataTable success");
  } catch (err) {
    console.log("KittyKartAsset:createMetadataTable error", err);
  }
});

task("KittyKartAsset:getMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");

  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    const kittyKartAssetTableIdBN = await kittyKartAsset.metadataTableId();
    const kittyKartAssetTableId = +kittyKartAssetTableIdBN.toString();
    writeValue("kittyKartAssetTableId", kittyKartAssetTableId);

    const kittyKartAssetTable = await kittyKartAsset.metadataTable();
    writeValue("kittyKartAssetTable", kittyKartAssetTable);

    const kittyKartAssetAttributeTable = await kittyKartAsset.attributeTable();
    writeValue("kittyKartAssetAttributeTable", kittyKartAssetAttributeTable);

    const kittyKartAssetAttributeTableId = await kittyKartAsset.attributeTableId();
    writeValue("kittyKartAssetAttributeTableId", kittyKartAssetAttributeTableId);

    console.log(
      "KittyKartAsset:getMetadataTable success",
      kittyKartAssetTableId,
      kittyKartAssetTable,
      kittyKartAssetAttributeTable,
    );
  } catch (err) {
    console.log("KittyKartAsset:getMetadataTable error", err);
  }
});

task("KittyKartAsset:setGameServer").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const gameServerAddress = readValue("gameServer");

  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    await kittyKartAsset.setGameServer(gameServerAddress);
    console.log("KittyKartAsset:setGameServer success", gameServerAddress);
  } catch (err) {
    console.log("KittyKartAsset:setGameServer error", err);
  }
});

task("KittyKartAsset:grantTableAccessToAutoBodyShop").setAction(async function (
  taskArguments: TaskArguments,
  { ethers },
) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");

  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    await kittyKartAsset.grantAccess(autoBodyShopProxyAddress);
    console.log("KittyKartAsset:grantTableAccessToAutoBodyShop success", autoBodyShopProxyAddress);
  } catch (err) {
    console.log("KittyKartAsset:grantTableAccessToAutoBodyShop error", err);
  }
});

task("KittyKartAsset:setAutoBodyShopToApprovedMarketplace").setAction(async function (
  taskArguments: TaskArguments,
  { ethers },
) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");

  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    await kittyKartAsset.setApprovedMarketplace(autoBodyShopProxyAddress, true);
    console.log("KittyKartAsset:setAutoBodyShopToApprovedMarketplace success", autoBodyShopProxyAddress);
  } catch (err) {
    console.log("KittyKartAsset:setAutoBodyShopToApprovedMarketplace error", err);
  }
});

task("KittyKartAsset:setAutoBodyShop").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartAssetProxyAddress = readContractAddress("kittyKartAssetProxy");
  const autoBodyShopProxyAddress = readContractAddress("autoBodyShopProxy");

  // attach kittyKartAsset
  const kittyKartAssetFactory: KittyKartAsset__factory = <KittyKartAsset__factory>(
    await ethers.getContractFactory("KittyKartAsset", accounts[0])
  );
  const kittyKartAsset: KittyKartAsset = await kittyKartAssetFactory.attach(kittyKartAssetProxyAddress);

  try {
    await kittyKartAsset.setAutoBodyShop(autoBodyShopProxyAddress);
    console.log("KittyKartAsset:setAutoBodyShop success", autoBodyShopProxyAddress);
  } catch (err) {
    console.log("KittyKartAsset:setAutoBodyShop error", err);
  }
});
