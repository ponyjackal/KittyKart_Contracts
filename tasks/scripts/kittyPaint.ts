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
    const kittyPaintTableId = await kittyPaint.createMetadataTable(registryAddress);
    writeValue("kittyPaintTableId", kittyPaintTableId);
    console.log("KittyPaint:createMetadataTable success", kittyPaintTableId);
  } catch (err) {
    console.log("KittyPaint:createMetadataTable error", err);
  }
});
