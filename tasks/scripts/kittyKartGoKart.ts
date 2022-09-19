import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKartGoKart } from "../../src/types/contracts/KittyKartGoKart";
import { KittyKartGoKart__factory } from "../../src/types/factories/contracts/KittyKartGoKart__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

task("KittyKartGoKart:createMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");
  const registryAddress = readValue("registry");

  // attatch KittyKartGoKart
  const kittyKartGoKartFactory: KittyKartGoKart__factory = <KittyKartGoKart__factory>(
    await ethers.getContractFactory("KittyKartGoKart", accounts[0])
  );
  const kittyKartGoKart: KittyKartGoKart = await kittyKartGoKartFactory.attach(kittyKartGoKartProxyAddress);

  try {
    await kittyKartGoKart.createMetadataTable(registryAddress);
    console.log("KittyKartGoKart:createMetadataTable success");
  } catch (err) {
    console.log("KittyKartGoKart:createMetadataTable error", err);
  }
});

task("KittyKartGoKart:getMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");

  // attatch KittyKartGoKart
  const kittyKartGoKartFactory: KittyKartGoKart__factory = <KittyKartGoKart__factory>(
    await ethers.getContractFactory("KittyKartGoKart", accounts[0])
  );
  const kittyKartGoKart: KittyKartGoKart = await kittyKartGoKartFactory.attach(kittyKartGoKartProxyAddress);

  try {
    const kittyKartGoKartTableIdBN = await kittyKartGoKart.metadataTableId();
    const kittyKartGoKartTableId = +kittyKartGoKartTableIdBN.toString();
    writeValue("kittyKartGoKartTableId", kittyKartGoKartTableId);

    const kittyKartGoKartTable = await kittyKartGoKart.metadataTable();
    writeValue("kittyKartGoKartTable", kittyKartGoKartTable);
    console.log("KittyKartGoKart:getMetadataTable success", kittyKartGoKartTableId, kittyKartGoKartTable);
  } catch (err) {
    console.log("KittyKartGoKart:getMetadataTable error", err);
  }
});

task("KittyKartGoKart:setAssetAttributeTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartGoKartProxyAddress = readContractAddress("kittyKartGoKartProxy");
  const kittyKartAssetAttributeTable = readValue("kittyKartAssetAttributeTable");

  // attatch KittyKartGoKart
  const kittyKartGoKartFactory: KittyKartGoKart__factory = <KittyKartGoKart__factory>(
    await ethers.getContractFactory("KittyKartGoKart", accounts[0])
  );
  const kittyKartGoKart: KittyKartGoKart = await kittyKartGoKartFactory.attach(kittyKartGoKartProxyAddress);

  try {
    await kittyKartGoKart.setAssetAttributeTable(kittyKartAssetAttributeTable);
    console.log("KittyKartGoKart:setAssetAttributeTable success", kittyKartAssetAttributeTable);
  } catch (err) {
    console.log("KittyKartGoKart:setAssetAttributeTable error", err);
  }
});
