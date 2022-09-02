import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyAsset } from "../../src/types/contracts/KittyAsset";
import { KittyAsset__factory } from "../../src/types/factories/contracts/KittyAsset__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

task("KittyAsset:createMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyAssetProxyAddress = readContractAddress("kittyAssetProxy");
  const registryAddress = readValue("registry");

  // attatch kittyAsset
  const kittyAssetFactory: KittyAsset__factory = <KittyAsset__factory>(
    await ethers.getContractFactory("KittyAsset", accounts[0])
  );
  const kittyAsset: KittyAsset = await kittyAssetFactory.attach(kittyAssetProxyAddress);

  try {
    await kittyAsset.createMetadataTable(registryAddress);
    console.log("KittyAsset:createMetadataTable success");
  } catch (err) {
    console.log("KittyAsset:createMetadataTable error", err);
  }
});

task("KittyAsset:getMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyAssetProxyAddress = readContractAddress("kittyAssetProxy");

  // attatch kittyAsset
  const kittyAssetFactory: KittyAsset__factory = <KittyAsset__factory>(
    await ethers.getContractFactory("KittyAsset", accounts[0])
  );
  const kittyAsset: KittyAsset = await kittyAssetFactory.attach(kittyAssetProxyAddress);

  try {
    const kittyAssetTableIdBN = await kittyAsset.metadataTableId();
    const kittyAssetTableId = +kittyAssetTableIdBN.toString();
    writeValue("kittyAssetTableId", kittyAssetTableId);

    const kittyAssetTable = await kittyAsset.metadataTable();
    writeValue("kittyAssetTable", kittyAssetTable);
    console.log("KittyAsset:getMetadataTable success", kittyAssetTableId, kittyAssetTable);
  } catch (err) {
    console.log("KittyAsset:getMetadataTable error", err);
  }
});

task("KittyAsset:setGameServer").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyAssetProxyAddress = readContractAddress("kittyAssetProxy");
  const gameServerAddress = readValue("gameServer");

  // attatch kittyAsset
  const kittyAssetFactory: KittyAsset__factory = <KittyAsset__factory>(
    await ethers.getContractFactory("KittyAsset", accounts[0])
  );
  const kittyAsset: KittyAsset = await kittyAssetFactory.attach(kittyAssetProxyAddress);

  try {
    await kittyAsset.setGameServer(gameServerAddress);
    console.log("KittyAsset:setGameServer success", gameServerAddress);
  } catch (err) {
    console.log("KittyAsset:setGameServer error", err);
  }
});
