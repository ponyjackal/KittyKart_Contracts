import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KittyPaint } from "../../src/types/contracts/KittyPaint";
import { KittyPaint__factory } from "../../src/types/factories/contracts/KittyPaint__factory";
import { readContractAddress } from "../deploy/addresses/utils";
import { readValue, writeValue } from "./values/utils";

task("KittyPaint:createMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyPaintProxyAddress = readContractAddress("kittyPaintProxy");
  const registryAddress = readValue("registry");

  // attatch KittyPaint
  const kittyPaintFactory: KittyPaint__factory = <KittyPaint__factory>(
    await ethers.getContractFactory("KittyPaint", accounts[0])
  );
  const kittyPaint: KittyPaint = await kittyPaintFactory.attach(kittyPaintProxyAddress);

  try {
    await kittyPaint.createMetadataTable(registryAddress);
    console.log("KittyPaint:createMetadataTable success");
  } catch (err) {
    console.log("KittyPaint:createMetadataTable error", err);
  }
});

task("KittyPaint:getMetadataTable").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const kittyPaintProxyAddress = readContractAddress("kittyPaintProxy");
  const registryAddress = readValue("registry");

  // attatch KittyPaint
  const kittyPaintFactory: KittyPaint__factory = <KittyPaint__factory>(
    await ethers.getContractFactory("KittyPaint", accounts[0])
  );
  const kittyPaint: KittyPaint = await kittyPaintFactory.attach(kittyPaintProxyAddress);

  try {
    const kittyPaintTableIdBN = await kittyPaint.metadataTableId();
    const kittyPaintTableId = +kittyPaintTableIdBN.toString();
    writeValue("kittyPaintTableId", kittyPaintTableId);

    const kittyPaintTable = await kittyPaint.metadataTable();
    writeValue("kittyPaintTable", kittyPaintTable);
    console.log("KittyPaint:getMetadataTable success", kittyPaintTableId, kittyPaintTable);
  } catch (err) {
    console.log("KittyPaint:getMetadataTable error", err);
  }
});
