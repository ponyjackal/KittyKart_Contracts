import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyKart } from "../../src/types/contracts/KittyKart";
import { KittyKart__factory } from "../../src/types/factories/contracts/KittyKart__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

task("KittyKart:createMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartProxyAddress = readContractAddress("kittyKartProxy");
  const registryAddress = readValue("registry");

  // attatch KittyKart
  const kittyKartFactory: KittyKart__factory = <KittyKart__factory>(
    await ethers.getContractFactory("KittyKart", accounts[0])
  );
  const kittyKart: KittyKart = await kittyKartFactory.attach(kittyKartProxyAddress);

  try {
    await kittyKart.createMetadataTable(registryAddress);
    console.log("KittyKart:createMetadataTable success");
  } catch (err) {
    console.log("KittyKart:createMetadataTable error", err);
  }
});

task("KittyKart:getMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartProxyAddress = readContractAddress("kittyKartProxy");

  // attatch KittyKart
  const kittyKartFactory: KittyKart__factory = <KittyKart__factory>(
    await ethers.getContractFactory("KittyKart", accounts[0])
  );
  const kittyKart: KittyKart = await kittyKartFactory.attach(kittyKartProxyAddress);

  try {
    const kittyKartTableIdBN = await kittyKart.metadataTableId();
    const kittyKartTableId = +kittyKartTableIdBN.toString();
    writeValue("kittyKartTableId", kittyKartTableId);

    const kittyKartTable = await kittyKart.metadataTable();
    writeValue("kittyKartTable", kittyKartTable);
    console.log("KittyKart:getMetadataTable success", kittyKartTableId, kittyKartTable);
  } catch (err) {
    console.log("KittyKart:getMetadataTable error", err);
  }
});

task("KittyKart:setAssetAttributeTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyKartProxyAddress = readContractAddress("kittyKartProxy");
  const kittyAssetAttributeTable = readValue("kittyAssetAttributeTable");

  // attatch KittyKart
  const kittyKartFactory: KittyKart__factory = <KittyKart__factory>(
    await ethers.getContractFactory("KittyKart", accounts[0])
  );
  const kittyKart: KittyKart = await kittyKartFactory.attach(kittyKartProxyAddress);

  try {
    await kittyKart.setAssetAttributeTable(kittyAssetAttributeTable);

    console.log("KittyKart:setAssetAttributeTable success");
  } catch (err) {
    console.log("KittyKart:setAssetAttributeTable error", err);
  }
});
